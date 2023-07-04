import { Request, Response } from "express";
import { Post } from "../../entity/post/post.entity";
import { User } from "../../entity/user/user.entity";
import { LocationType } from "../../entity";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import { reactionTagRepo } from "../misc/reaction";
import { NoItem } from "../../lib/errors";
import { Database } from "../../database";
import { PostReaction } from "../../entity/post/post_reaction.entity";
import { goodRequest } from "../../lib/response";

export const postReactionRepo = Database.getRepository(PostReaction)

class PostReactionController {
	async reactToPost(req: Request, res: Response) {
		const user = res.locals.user as User
		const post = res.locals.post as Post
		const location = res.locals.location as LocationType

		const result = validationResult(req)
		const { reaction_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		// find the reaction tag
		const reactionTag = await reactionTagRepo.findOneBy({ id: reaction_id })
		if (!reactionTag) throw new NoItem('reaction tag')

		// find if reaction already exists
		const reaction = await postReactionRepo.findOne({
			where: {
				post: { id: post.id },
				user: { sub: user.sub },
			}
		})

		if (reaction) {
			await postReactionRepo.remove(reaction)
		} else {
			await postReactionRepo.save(new PostReaction(reactionTag, post, user, location))
		}

		goodRequest(res)
	}
}

export default new PostReactionController()