import { Request, Response } from "express";
import { User } from "../../entity/user/user.entity";
import { goodRequest } from "../../lib/response";
import { Database } from "../../database";
import { UserInterest } from "../../entity/user/user_interest.entity";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import { DEFAULT_CATEGORIES, userRepo } from ".";
import { UserPicture } from "../../entity/user/user_picture.entity";
import { UserPictureCategory } from "../../entity/user/user_picture_category.entity";
import { interestRepo } from "../misc";

export const userInterestRepo = Database.getRepository(UserInterest)
export const userPictureRepo = Database.getRepository(UserPicture)
export const userPictureCategoryRepo = Database.getRepository(UserPictureCategory)

class userProfileController {
	async readSelfProfile(req: Request, res: Response) {
		const user = res.locals.user as User
		const interests = await userInterestRepo
			.query(`
				SELECT interest.*
				FROM user_interest
				LEFT JOIN interest ON user_interest.interest_id = interest.interest_id
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
		const { first_name, last_name, birthday, marital_status, nationality, profile_privacy, interests } = matchedData(req)

		let edited = !!(first_name || last_name || birthday || marital_status || nationality || profile_privacy || interests)

		if (first_name) {
			user.profile.firstName = first_name
		} // first name

		if (last_name) {
			user.profile.lastName = last_name
		} // last name

		if (birthday) {
			user.profile.birthday = birthday
		} // birthday

		if (marital_status) {
			user.profile.maritalStatus = marital_status
		} // marital status

		if (nationality) {
			user.profile.nationality = nationality
		} // nationality

		if (profile_privacy) {
			user.profile.profilePrivacy = profile_privacy
		} // profile privacy

		if (interests) {
			try {
				const items = JSON.parse(interests).map((item: string) => Number(item))
				await userInterestRepo.delete({
					profile: user.profile.id
				})

				for await (const id of items) {
					const interest = await interestRepo.findOneBy({ id })

					if (interest) {
						try { await userInterestRepo.save(new UserInterest(user.profile.id, interest.id)) } catch { }
					}
				}
			} catch { }
		} // interests

		if (req.file) {
			// set the picture category
			let theCategory = user.pictureCategories.find(category => category.name === DEFAULT_CATEGORIES.pictures)
			if (!theCategory) {
				theCategory = new UserPictureCategory(DEFAULT_CATEGORIES.pictures)
				theCategory.user = user
				await userPictureCategoryRepo.save(theCategory)
			}

			// create user picture
			const userPicture = new UserPicture()
			userPicture.category = theCategory
			userPicture.path = req.file.filename

			await userPictureRepo.save(userPicture)

			// update relations
			user.profile.profilePicture.picture = userPicture
		} // profile picture

		user.profile.newUser = !edited
		await userRepo.save(user)

		goodRequest(res)
	}
}

export default new userProfileController()