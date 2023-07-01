import { Request, Response } from "express"
import { Database } from "../../database"
import { User } from "../../entity/user/user.entity"
import { badRequest, goodRequest } from "../../lib/response"

export const userRepo = Database.getRepository(User)


export const DEFAULT_CATEGORIES = {
	audio: "My Voice Notes",
	pictures: "My Pictures",
	videos: "My Videos",
}


class UserController {
	async isNewUser(req: Request, res: Response) {
		return (res.locals.user as User).profile.newUser ? goodRequest(res) : badRequest(res)
	}
}

export default new UserController()