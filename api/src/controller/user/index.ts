import { Request, Response } from "express"
import { Database } from "../../database"
import { User } from "../../entity/user/user.entity"
import { badRequest, goodRequest } from "../../lib/response"
import { NoItem } from "../../lib/errors"
import { Privacy } from "../../entity"
import { UserFollower } from "../../entity/user/user_follower.entity"

export const userRepo = Database.getRepository(User)


export const DEFAULT_CATEGORIES = {
	audio: "My Voice Notes",
	pictures: "My Pictures",
	videos: "My Videos",
}

export const userFollowerRepo = Database.getRepository(UserFollower)

class UserController {
	async isNewUser(req: Request, res: Response) {
		return (res.locals.user as User).profile.newUser ? goodRequest(res) : badRequest(res)
	}

	async readUserProfile(req: Request, res: Response) {
		const user = res.locals.user as User

		const theUser = await userRepo.findOneBy({ sub: req.query.user_sub as string })
		if (!theUser) throw new NoItem()

		let data: any = {}

		switch (theUser.profile.profilePrivacy) {
			case Privacy.Everyone:
				data = user
				break
			case Privacy.Followers:
				break
			case Privacy.GroupMembers:
				break
			case Privacy.NearMe:
				break
			case Privacy.OnlyMe:
				data = {
					sub: user.sub,
					createdAt: user.createdAt,
					onlineStatusPrivacy: user.onlineStatusPrivacy,
				}
				break
			default:
		}

		goodRequest(res, data)
	} // read user profile
}

export default new UserController()