import { Request, Response } from "express";
import { User } from "../../entity/user/user.entity";
import { goodRequest } from "../../lib/response";
import { Database } from "../../database";
import { UserInterest } from "../../entity/user/user_interest.entity";
import { matchedData, validationResult } from "express-validator";
import { BadFields, NoItem, Unauthorized, error } from "../../lib/errors";
import { DEFAULT_CATEGORIES, userFollowerRepo, userRepo } from ".";
import { UserPicture } from "../../entity/user/user_picture.entity";
import { UserPictureCategory } from "../../entity/user/user_picture_category.entity";
import { interestRepo } from "../misc/interest";
import { Gender, Privacy } from "../../entity";
import { getFollowers, readUserProfile } from "./static";

export const userInterestRepo = Database.getRepository(UserInterest)
export const userPictureRepo = Database.getRepository(UserPicture)
export const userPictureCategoryRepo = Database.getRepository(UserPictureCategory)

class userProfileController {
	async readSelfProfile(req: Request, res: Response) {
		const user = res.locals.user as User | any

		delete user.pictureCategories

		goodRequest(res, {
			user: await readUserProfile(user as User)
		})
	}

	async readOtherProfile(req: Request, res: Response) {
		const result = validationResult(req)
		const { user_sub: sub } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const user = await userRepo.findOne({
			where: { sub },
			relations: ["profile", "profile.profilePicture.picture"]
		})

		if (!user) throw new NoItem("User")

		// handle profile privacy
		if (user.profile.profilePrivacy === Privacy.OnlyMe) throw new Unauthorized()

		goodRequest(res, {
			user: await readUserProfile(user as User)
		})
	}

	async updateSelfProfile(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields(result)

		const user = res.locals.user as User
		const { first_name, last_name, gender, birthday, marital_status, nationality, profile_privacy, interests } = matchedData(req)

		let edited = !!(first_name || last_name || gender || birthday || marital_status || nationality || profile_privacy || interests)

		if (first_name) {
			user.profile.firstName = first_name
		} // first name

		if (last_name) {
			user.profile.lastName = last_name
		} // last name

		if (gender && gender.toLowerCase() in Gender) {
			user.profile.gender = gender.toLowerCase()
		} // gender

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

	async getMyFollowers(req: Request, res: Response) {
		const user = res.locals.user as User

		const followers = await getFollowers(user)

		goodRequest(res, { followers })
	}

	async followUser(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields(result)

		const user = res.locals.user as User
		const { user_sub: sub } = matchedData(req)

		if (user.sub === sub) throw new error("You can't follow yourself")

		const following = await userRepo.findOneBy({ sub })
		if (!following) throw new NoItem("User")

		const row = await userFollowerRepo.create({
			follower: user.sub,
			following: following.sub
		})

		await userFollowerRepo.save(row)

		goodRequest(res)
	}

	async unfollowUser(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields(result)

		const user = res.locals.user as User
		const { user_sub: sub } = matchedData(req)

		const row = await userFollowerRepo.findOneBy({
			follower: user.sub,
			following: sub
		})

		if (row) await userFollowerRepo.remove(row)

		goodRequest(res)
	}
}

export default new userProfileController()