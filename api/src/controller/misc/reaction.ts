import { Request, Response } from "express";
import { Database } from "../../database";
import { goodRequest } from "../../lib/response";
import { BadFields, NoItem } from "../../lib/errors";
import { matchedData, validationResult } from "express-validator";
import { ReactionTag } from "../../entity/post/reaction_tag.entity";

export const reactionRepo = Database.getRepository(ReactionTag)

class ReactionController {
	async readReaction(req: Request, res: Response) {
		const { reaction_id, reaction_name } = matchedData(req)

		goodRequest(res, {
			reactions: await reactionRepo.find({
				where: {
					...(reaction_id ? { id: reaction_id } : null),
					...(reaction_name ? { name: reaction_name } : null),
				}
			})
		})
	}

	async createReaction(req: Request, res: Response) {
		const result = validationResult(req)
		const { reaction_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const reaction = new ReactionTag(reaction_name)

		await reactionRepo.save(reaction)

		goodRequest(res)
	}

	async updateReaction(req: Request, res: Response) {
		const result = validationResult(req)
		const { reaction_id, reaction_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const reaction = await reactionRepo.findOneBy({ id: reaction_id })
		if (!reaction) throw new NoItem()

		reaction.name = reaction_name

		await reactionRepo.save(reaction)

		goodRequest(res)
	}

	async removeReaction(req: Request, res: Response) {
		const result = validationResult(req)
		const { reaction_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const reaction = await reactionRepo.findOneBy({ id: reaction_id })
		if (!reaction) throw new NoItem()

		await reactionRepo.remove(reaction)

		goodRequest(res)
	}
}

export default new ReactionController()