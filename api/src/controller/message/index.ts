import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { BadFields, NoItem, error } from "../../lib/errors";
import { User } from "../../entity/user/user.entity";
import { Message } from "../../entity/misc/message.entity";
import { Database } from "../../database";
import { userRepo } from "../user";
import { goodRequest } from "../../lib/response";
import { newMessage } from "./static";
import { FileObject } from "../../lib/file_upload";
import { newNotification } from "../notification/static";
import { NotificationType } from "../../entity";
import { compareAsc } from "date-fns";
import readMessage from "../../socket/events/read_message";

export const messageRepo = Database.getRepository(Message)

class MessageController {
	async getConversations(req: Request, res: Response) {
		const user = res.locals.user as User

		const sql = `
		SELECT
			MAX (message.created_at) AS created_at,

			JSON_OBJECT (
				'sub', from_user.user_id,
				'firstName', from_user_profile.first_name,
				'lastName', from_user_profile.last_name,
				'profilePicture', from_user_picture.path
			) AS \`from\`,

			LEAST (message.from_user_id, message.to_user_id) AS group_a,
			GREATEST (message.from_user_id, message.to_user_id) AS group_b
		FROM message

		LEFT JOIN user AS from_user ON from_user.user_id = CASE
			WHEN message.from_user_id = "${user.sub}"
				THEN message.to_user_id
				ELSE message.from_user_id
			END

		LEFT JOIN user_profile AS from_user_profile
			ON from_user_profile.user_profile_id = from_user.user_profile_id

		LEFT JOIN profile_picture AS from_user_profile_picture
			ON from_user_profile_picture.profile_picture_id = from_user_profile.profile_picture_id

		LEFT JOIN user_picture AS from_user_picture
			ON from_user_picture.user_picture_id = from_user_profile_picture.user_picture_id

		
		WHERE to_user_id = "${user.sub}" OR from_user_id = "${user.sub}"
		GROUP BY group_a, group_b
	`

		const conversations = await messageRepo.query(sql)

		// get last message for each conversation
		for await (const conversation of conversations) {
			const fromMessage = await messageRepo.findOne({
				where: { from: { sub: conversation.from.sub }, to: { sub: user.sub } },
				order: {
					createdAt: "DESC"
				}
			})
			const toMessage = await messageRepo.findOne({
				where: { from: { sub: user.sub }, to: { sub: conversation.from.sub } },
				order: {
					createdAt: "DESC"
				}
			})

			if (fromMessage && !toMessage) conversation.lastMessage = fromMessage
			else if (!fromMessage && toMessage) conversation.lastMessage = toMessage
			else if (fromMessage && toMessage) conversation.lastMessage = compareAsc(new Date(fromMessage.createdAt), new Date(toMessage.createdAt)) === 1 ? fromMessage : toMessage
			else conversation.lastMessage = null
		}

		goodRequest(res, { user, conversations })
	}

	async getSingleConversation(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { to, limit: messageLimit } = matchedData(req)

		const limit = messageLimit ? parseInt(messageLimit) : 10

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const sql = `
		SELECT
			message.created_at AS created_at,
		
			JSON_OBJECT (
				'id', message.message_id,
				'createdAt', message.created_at,
				'isRead', message.is_read,
				'forwardFrom', message.forward_from_message_id,
				'replyTo', message.reply_to_message_id,
				'pictureMessage', message.picture_message,
				'audioMessage', message.audio_message,
				'videoMessage', message.video_message,
				'textMessage', message.text_message
			) as message,

			JSON_OBJECT (
				'sub', from_user.user_id,
				'firstName', from_user_profile.first_name,
				'lastName', from_user_profile.last_name,
				'profilePicture', from_user_picture.path
			) AS \`from\`
		FROM message

		LEFT JOIN user AS from_user
			ON from_user.user_id = message.from_user_id

		LEFT JOIN user_profile AS from_user_profile
			ON from_user_profile.user_profile_id = from_user.user_profile_id

		LEFT JOIN profile_picture AS from_user_profile_picture
			ON from_user_profile_picture.profile_picture_id = from_user_profile.profile_picture_id

		LEFT JOIN user_picture AS from_user_picture
			ON from_user_picture.user_picture_id = from_user_profile_picture.user_picture_id

		WHERE
			(message.from_user_id = "${user.sub}" AND message.to_user_id="${recipient.sub}")
			OR
			(message.from_user_id = "${recipient.sub}" AND message.to_user_id="${user.sub}")

		ORDER BY message.created_at DESC
	`

		const conversation = await messageRepo.query(sql)

		conversation.forEach((c: any) => {
			if (c.from.sub === user.sub) delete c.from
		})

		goodRequest(res, { conversation })
	}

	async sendMessage(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { to, text } = matchedData(req)

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const message = newMessage(
			user,
			recipient,
			res.locals.location,
			text,
			req.files as FileObject
		)

		await messageRepo.save(message)

		// send notifcation to recipient
		await newNotification(recipient, NotificationType.NewMessage, user, null, null, null, message)

		goodRequest(res, { message })
	}

	async replyToMessage(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { message_id, text, to } = matchedData(req)

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const replyTo = await messageRepo.findOneBy({ id: message_id })
		if (!replyTo) throw new NoItem("Recipient")

		// check reply message belongs to the conversation
		const correctConversation = (replyTo.from.sub === user.sub && replyTo.to.sub == recipient.sub) || (replyTo.to.sub === user.sub && replyTo.from.sub == recipient.sub)

		if (!correctConversation) throw new error("no message found in conversation")

		const message = newMessage(
			user,
			recipient,
			res.locals.location,
			text,
			req.files as FileObject,
			null,
			replyTo
		)

		await messageRepo.save(message)

		// send notifcation to recipient
		await newNotification(recipient, NotificationType.NewMessage, user, null, null, null, message)

		goodRequest(res, { message })
	}

	async forwardMessage(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { message_id, to } = matchedData(req)

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const forwardFrom = await messageRepo.findOneBy({ id: message_id })
		if (!forwardFrom) throw new NoItem("Message")

		const message = newMessage(
			user,
			recipient,
			res.locals.location,
			"",
			undefined,
			forwardFrom,
			null,
		)

		await messageRepo.save(message)

		// send notifcation to recipient
		await newNotification(recipient, NotificationType.NewMessage, user, null, null, null, message)

		goodRequest(res, { message })
	}

	async markAsRead(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { message_id } = matchedData(req)

		const message = await messageRepo.findOneBy({ id: message_id })
		if (!message) throw new NoItem("Message")

		if (message.to.sub !== user.sub) throw new error("You can't read this message")

		message.is_read = true
		await messageRepo.save(message)

		// notify sender about the read status
		readMessage(message.from.sub, message_id)

		goodRequest(res, { message })
	}

	async editMessage(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { message_id, text } = matchedData(req)

		const message = await messageRepo.findOne({
			where: {
				id: message_id,
				from: { sub: user.sub }
			},
			relations: ["from", "to"]
		})
		if (!message) throw new NoItem("Message")

		if (message.from.sub !== user.sub) throw new error("You can't edit this message")

		const editedMessage = newMessage(
			user,
			message.to,
			res.locals.location,
			text,
			req.files as FileObject,
			message.forwardFrom,
			message.replyTo,
			message
		)

		await messageRepo.save(editedMessage)

		goodRequest(res, { message: editedMessage })
	}

	async deleteMessage(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { message_id } = matchedData(req)

		const message = await messageRepo.findOneBy({ id: message_id })
		if (!message) throw new NoItem("Message")

		if (message.from.sub !== user.sub) throw new error("You can't delete this message")

		await messageRepo.remove(message)

		goodRequest(res, { message })
	}
}

export default new MessageController()