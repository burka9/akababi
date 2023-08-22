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

export const messageRepo = Database.getRepository(Message)

class MessageController {
	async getConversations(req: Request, res: Response) {
		const user = res.locals.user as User

		const conversations = [
			// ...await messageRepo
			// 	.createQueryBuilder("message")
			// 	.select("message.createdAt")
			// 	.leftJoin("message.from", "from_user")
			// 	.leftJoin("message.to", "to_user")
			// 	.addSelect("from_user.sub")
			// 	.addSelect("to_user.sub")
			// 	.where("message.from_user_id = :sub", { sub: user.sub })
			// 	.orWhere('message.to_user_id = :sub', { sub: user.sub })
			// 	.groupBy("message.to")
			// 	.addGroupBy("message.from")
			// 	.getMany(),
			... await messageRepo.
				query(`
			SELECT MIN(message.created_at) AS created_at,
      	CASE WHEN from_user.user_id <= to_user.user_id THEN from_user.user_id ELSE to_user.user_id END AS from_user,
      	CASE WHEN from_user.user_id <= to_user.user_id THEN to_user.user_id ELSE from_user.user_id END AS to_user
			FROM message
			LEFT JOIN user from_user ON message.from_user_id = from_user.user_id
			LEFT JOIN user to_user ON message.to_user_id = to_user.user_id
			WHERE message.from_user_id = "${user.sub}"
   			OR message.to_user_id = "${user.sub}"
			GROUP BY from_user, to_user;
			`)
		]

		console.log(conversations)

		conversations.map((conversation: any) => {
			conversation.from = { sub: conversation.from_user }
			conversation.to = { sub: conversation.to_user }
			delete conversation.from_user
			delete conversation.to_user
		})

		goodRequest(res, { conversations })
	}

	async getSingleConversation(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { to } = matchedData(req)

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const conversation = [
			...await messageRepo.find({
				where: {
					from: { sub: user.sub },
					to: { sub: recipient.sub }
				},
				order: {
					createdAt: "DESC"
				},
				relations: ["from", "from.profile", "to", "to.profile", "replyTo"]
			}),
			...await messageRepo.find({
				where: {
					from: { sub: recipient.sub },
					to: { sub: user.sub }
				},
				order: {
					createdAt: "DESC"
				},
				relations: ["from", "from.profile", "to", "to.profile", "replyTo"]
			})
		]

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