import { Request, Response } from "express";
import { User } from "../../entity/user/user.entity";
import { goodRequest } from "../../lib/response";
import { Database } from "../../database";
import { UserInterest } from "../../entity/user/user_interest.entity";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";

export const userInterestRepo = Database.getRepository(UserInterest)

class userProfileController {
	async readSelfProfile(req: Request, res: Response) {
		const user = res.locals.user as User
		const interests = await userInterestRepo
			.query(`
				SELECT DISTINCT interest.*
				FROM user_interest
				LEFT JOIN interest ON user_interest.interest_id
				WHERE user_interest.user_profile_id = ${user.profile.id}
			`)

		goodRequest(res, {
			user: { ...user, interests }
		})
	}

	async updateSelfProfile(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields(result)

		const user = res.locals.user as User
		const { firstName, lastName, birthday, maritalStatus, nationality, interests, profilePrivacy } = matchedData(req)

		goodRequest(res)
	}
}

export default new userProfileController()