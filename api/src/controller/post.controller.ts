import { NextFunction, Request, Response } from "express"
import logger from "../lib/logger"
import { badRequest, goodRequest } from "../lib/response"
import { User } from "../entity/user/user.entity"
import { Post } from "../entity/post/post.entity"
import { Database } from "../database"
import { PostComment } from "../entity/post/post.comment.entity"
import { PostReaction, Reaction } from "../entity/post/post.reaction.entity"
import { In } from "typeorm"

export const postRepo = Database.getRepository(Post)
export const postCommentRepo = Database.getRepository(PostComment)
export const postReactionRepo = Database.getRepository(PostReaction)

export class PostController {
	static async IncludePost(req: Request, res: Response, next: NextFunction, postId: number) {
		logger.debug(`include post param`)

		const post = await postRepo.findOne({
			where: { id: Number(postId) },
			loadRelationIds: true,
		})

		res.locals.post = post

		next()
	}

	async createPost(req: Request, res: Response) {
		logger.debug(`create post request: ${req.url}`)
		const user = res.locals.user as User

		const { title, text, category } = req.body

		const newPost = new Post()
		newPost.title = title
		newPost.textContent = text
		newPost.imageContentPath = []
		newPost.audioContentPath = []
		newPost.videoContentPath = []
		newPost.user = user
		newPost.category = category

		// file attachment
		if (req.files) {
			const { image, audio, video }: {
				image: Express.Multer.File[],
				audio: Express.Multer.File[],
				video: Express.Multer.File[],
			} = req.files as any

			// image handler
			if (image) image.forEach((img) => newPost.imageContentPath.push(img.filename))

			// image handler
			if (audio) audio.forEach((aud) => newPost.audioContentPath.push(aud.filename))

			// video handler
			if (video) video.forEach((vid) => newPost.videoContentPath.push(vid.filename))
		}

		await postRepo.save(newPost)

		// set location
		await Database.query(`UPDATE post SET location=${res.locals.locationString} WHERE id=${newPost.id}`)

		goodRequest(res)
	}

	async getAllPosts(req: Request, res: Response) {
		logger.debug(`get all posts request: ${req.url}`)
		const { limit } = req.query

		const posts = await postRepo.find({
			order: {
				createdAt: 'desc'
			},
			loadRelationIds: true
		})

		goodRequest(res, [
			"posts",
			posts
		])
	}

	async getSinglePost(req: Request, res: Response) {
		logger.debug(`get single post request: ${req.url}`)
		const post = res.locals.post as Post

		goodRequest(res, [
			"post",
			post
		])
	}

	async commentOnPost(req: Request, res: Response) {
		logger.debug(`comment on post request: ${req.url}`)
		const user = res.locals.user as User
		const post = res.locals.post as Post

		const { comment } = req.body

		const theComment = new PostComment()
		theComment.textComment = comment
		theComment.user = user
		theComment.post = post

		// file attachment
		if (req.files) {
			const { image, audio, video }: {
				image: Express.Multer.File[],
				audio: Express.Multer.File[],
				video: Express.Multer.File[],
			} = req.files as any

			// image handler
			if (image) image.forEach((img) => theComment.imageCommentPath = img.filename)

			// image handler
			if (audio) audio.forEach((aud) => theComment.audioCommentPath = aud.filename)

			// video handler
			if (video) video.forEach((vid) => theComment.videCommentPath = vid.filename)
		}

		await postCommentRepo.save(theComment)

		goodRequest(res)
	}

	async getPostComments(req: Request, res: Response) {
		logger.debug(`get post comments request: ${req.url}`)
		const post = res.locals.post as Post

		const comments = await postCommentRepo.find({
			where: {
				id: In(post.comments)
			},
			loadRelationIds: true
		})

		goodRequest(res, [
			"comments",
			comments
		])
	}

	async reactToPost(req: Request, res: Response) {
		logger.debug(`react to post request: ${req.url}`)
		const user = res.locals.user as User
		const post = res.locals.post as Post

		const { reaction: reactionBody } = req.body

		const theReaction = await postReactionRepo.findOneBy({
			post: { id: post.id },
			user: { sub: user.sub }
		})

		if (theReaction) {
			await postReactionRepo.remove(theReaction)
		} else {
			const reaction = new PostReaction()
			reaction.reaction = reactionBody
			reaction.user = reaction.user
			reaction.post = reaction.post

			await postReactionRepo.save(reaction)
		}

		goodRequest(res)
	}

	async getPostReactions(req: Request, res: Response) {
		logger.debug(`get post reactions request: ${req.url}`)
		const post = res.locals.post as Post

		const reactions = await postReactionRepo.find({
			where: {
				id: In(post.reactions)
			},
			loadRelationIds: true
		})

		goodRequest(res, [
			"reactions",
			reactions
		])
	}
}

export default new PostController()