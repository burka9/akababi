import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import { goodRequest } from "../../lib/response";
import { Post } from "../../entity/post/post.entity";
import { User } from "../../entity/user/user.entity";
import { categoryRepo } from "../misc/category";
import { Database } from "../../database";
import { SharedPost } from "../../entity/post/shared_post.entity";

export const postRepo = Database.getRepository(Post)
export const sharedPostRepo = Database.getRepository(SharedPost)

class PostController {
	async readSinglePost(req: Request, res: Response) {
		const post = res.locals.post as Post

		goodRequest(res, { post })
	}

	async readSelfPosts(req: Request, res: Response) {
		const user = res.locals.user as User

		goodRequest(res, {
			posts: await postRepo.find({
				where: {
					user: { sub: user.sub }
				}
			})
		})
	}

	async viewPost(req: Request, res: Response) {
		const post = res.locals.post as Post

		post.views ++

		await postRepo.save(post)

		goodRequest(res)
	}

	async createPost(req: Request, res: Response) {
		const user = res.locals.user as User
		const result = validationResult(req)
		const { text, category_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const post = new Post()
		post.textContent = text
		post.imageContents = []
		post.audioContents = []
		post.videoContents = []
		post.user = user
		post.location = res.locals.location

		if (category_id) {
			const category = await categoryRepo.findOneBy({ id: category_id })
			if (category)
				post.category = category
		}

		// files
		if (req.files) {
			const { image, audio, video }: {
				image: Express.Multer.File[],
				audio: Express.Multer.File[],
				video: Express.Multer.File[],
			} = req.files as any

			if (image) image.forEach(file => post.imageContents.push(file.filename))
			if (audio) audio.forEach(file => post.audioContents.push(file.filename))
			if (video) video.forEach(file => post.videoContents.push(file.filename))
		}

		await postRepo.save(post)

		goodRequest(res)
	}

	async sharePost(req: Request, res: Response) {
		const user = res.locals.user as User
		const post = res.locals.post as Post

		const sharedPost = new SharedPost()

		sharedPost.location = res.locals.location
		sharedPost.post = post
		sharedPost.user = user

		await sharedPostRepo.save(sharedPost)

		goodRequest(res)
	}
}

export default new PostController()