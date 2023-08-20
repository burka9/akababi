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

		const conversations = await messageRepo
			.createQueryBuilder("message")
			.select("message.createdAt")
			.leftJoin("message.to", "to_user")
			.addSelect("to_user.sub")
			.where("message.from_user_id = :sub", { sub: user.sub })
			.groupBy("message.to")
			.getMany()

		goodRequest(res, { conversations })
	}

	async getSingleConversation(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { to } = matchedData(req)

		const recipient = await userRepo.findOneBy({ sub: to })
		if (!recipient) throw new NoItem("Recipient")

		const conversation = await messageRepo.find({
			where: {
				from: { sub: user.sub },
				to: { sub: recipient.sub }
			},
			order: {
				createdAt: "DESC"
			}
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
}

export default new MessageController()