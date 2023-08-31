import { validationResult, matchedData } from "express-validator"
import { User } from "../../entity/user/user.entity"
import { BadFields } from "../../lib/errors"
import { Request, Response } from "express"
import { Post } from "../../entity/post/post.entity"
import { goodRequest } from "../../lib/response"
import { PostComment } from "../../entity/post/post_comment.entity"
import { Database } from "../../database"
import { LocationType, NotificationType } from "../../entity"
import { newNotification } from "../notification/static"

export const postCommentRepo = Database.getRepository(PostComment)

class PostCommentController {
	async makeComment(req: Request, res: Response) {
		const user = res.locals.user as User
		const post = res.locals.post as Post
		const location = res.locals.location as LocationType

		const result = validationResult(req)
		const { text } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const comment = new PostComment()
		comment.user = user
		comment.post = post
		comment.location = location
		
		if (text) {
			comment.textComment = text
		} // text comment

		// files
		if (req.files) {
			const { image, audio, video }: {
				image: Express.Multer.File[],
				audio: Express.Multer.File[],
				video: Express.Multer.File[],
			} = req.files as any

			if (image && image[0]) comment.imageComment = image[0].filename // image comment
			if (audio && audio[0]) comment.audioComment = audio[0].filename // audio comment
			if (video && video[0]) comment.videoComment = video[0].filename // video comment
		}

		await postCommentRepo.save(comment)

		// send notification to post owner
		if (post.user.sub !== user.sub) {
			await newNotification(post.user, NotificationType.PostComment, user, post, comment)
		}

		goodRequest(res)
	}
}

export default new PostCommentController()