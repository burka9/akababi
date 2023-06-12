import { Request, Response } from "express";
import logger from "../lib/logger";
import { goodRequest } from "../lib/response";
import { Database } from "../database";
import { ReactionTag } from "../entity/reaction.tag.entity";

export const reactionRepo = Database.getRepository(ReactionTag)

class ReactionController {
	async getReactions(req: Request, res: Response) {
		logger.debug(`get reactions request ${req.url}`)

		goodRequest(res, [
			'reactions',
			(await reactionRepo.find({
				order: {
					name: "ASC"
				}
			})).map(item => item.name)
		])
	}
}

export default new ReactionController()