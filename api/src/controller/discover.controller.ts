import { Request, Response } from "express";
import logger from "../lib/logger";
import { goodRequest } from "../lib/response";
import { userRepo } from "./user.controller";

// distance in meters
const distance = {
	user: 10000,
	post: 10000
}

class DiscoverController {
	async discoverUser(req: Request, res: Response) {
		logger.debug(`discover request ${req.url}`)

		const { locationString } = res.locals

		const users = await userRepo.createQueryBuilder("user")
			.select()
			.leftJoinAndSelect("user.profile", "userProfile")
			.where(`ST_Distance_Sphere(user.location, ${locationString}) <= :distance`)
			.setParameter("distance", distance.user)
			.getMany()

		goodRequest(res, [
			"users",
			users
		])
	}
}

export default new DiscoverController()