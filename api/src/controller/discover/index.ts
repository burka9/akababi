import { Request, Response } from "express";
import { goodRequest } from "../../lib/response";
import Static from "./static";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import { Gender } from "../../entity";
import { APP } from "../../lib/env";
import { User } from "../../entity/user/user.entity";

const radius = APP.DISCOVER_RADIUS * 1000 // in kilometers

class DiscoverController {
	async discoverAll(req: Request, res: Response) {
		const user = res.locals.user as User
		const location = res.locals.location
		let postLimit = Number(req.query.postLimit)
		let lastPostId = Number(req.query.lastPostId)

		if (isNaN(postLimit)) postLimit = 10

		const users = await Static.discoverUser(location, radius)
		const posts = await Static.discoverPost(location, radius)

		const index = posts.findIndex(post => post.id === lastPostId)

		goodRequest(res, {
			users: user ? users.filter(u => user.sub !== u.sub) : users,
			posts: posts.slice(index === -1 ? 0 : index, postLimit)
		})
	}

	async discoverUser(req: Request, res: Response) {
		const user = res.locals.user as User
		const location = res.locals.location
		const result = validationResult(req)
		const { gender } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields()

		const users = (await Static.discoverUser(location, radius))
			.filter(user => gender in Gender ? user.gender === gender.toLowerCase() : true)

		goodRequest(res, {
			users: user ? users.filter(u => user.sub !== u.sub) : users
		})
	}

	async discoverPost(req: Request, res: Response) {
		const location = res.locals.location
		let postLimit = Number(req.query.postLimit)
		let lastPostId = Number(req.query.lastPostId)

		if (isNaN(postLimit)) postLimit = 10

		const posts = await Static.discoverPost(location, radius)

		const index = posts.findIndex(post => post.id === lastPostId)

		goodRequest(res, {
			posts: posts.slice(index === -1 ? 0 : index, postLimit)
		})
	}
}

export default new DiscoverController()