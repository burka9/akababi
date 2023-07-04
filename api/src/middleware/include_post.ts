import { NextFunction, Request, Response } from "express";
import { postRepo } from "../controller/post";
import { BadFields, NoItem } from "../lib/errors";
import logger from "../lib/logger";

export const IncludePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const postId = Number(req.query.post_id)

		if (isNaN(postId)) throw new BadFields()

		const post = await postRepo
			.createQueryBuilder("post")
			.leftJoinAndSelect("post.comments", "post_comment")
			.leftJoinAndSelect("post.reactions", "post_reaction")
			.leftJoin("post.user", "user")
			.addSelect("user.sub")
			.leftJoin("post_comment.user", "user_comment")
			.addSelect("user_comment.sub")
			.leftJoin("post_reaction.user", "user_reaction")
			.addSelect("user_reaction.sub")
			.leftJoinAndSelect("post_reaction.reaction", "reaction_tage")
			.where("post.id = :postId", { postId })
			.getOne()

		if (!post) throw new NoItem()

		res.locals.post = post

		next()
	} catch (err: any) {
		logger.error(err.message)
		throw err
	}
}