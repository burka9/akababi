import { Request, Response } from "express";
import { goodRequest } from "../../lib/response";
import Static from "./static";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import { Gender } from "../../entity";
import { APP } from "../../lib/env";

const radius = APP.DISCOVER_RADIUS * 1000 // in kilometers

class DiscoverController {
	async discoverAll(req: Request, res: Response) {
		const location = res.locals.location

		const users = await Static.discoverUser(location, radius)
		const posts = await Static.discoverPost(location, radius)

		goodRequest(res, { users, posts })
	}

	async discoverUser(req: Request, res: Response) {
		const location = res.locals.location
		const result = validationResult(req)
		const { gender } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields()

		const users = (await Static.discoverUser(location, radius))
			.filter(user => gender in Gender ? user.gender === gender.toLowerCase() : true)

		goodRequest(res, { users })
	}

	async discoverPost(req: Request, res: Response) {
		const location = res.locals.location

		const posts = await Static.discoverPost(location, radius)

		goodRequest(res, { posts })
	}
}

export default new DiscoverController()