import { NextFunction, Request, Response } from "express"
import logger from "../lib/logger"
import { goodRequest, noGoodRequest } from "../lib/response"
import { User } from "../entity/user/user.entity"
import { AUTH0 } from "../lib/env"
import axios from "axios"
import { Database } from "../database"
import { UserProfile } from "../entity/user/user.profile.entity"
import { isValid } from "date-fns"
import { getCode } from "country-list"
import { PrivacySetting } from "../entity/user/user.privacy.entity"

export const userRepo = Database.getRepository(User)
export const userProfileRepo = Database.getRepository(UserProfile)
export const privacyRepo = Database.getRepository(PrivacySetting)

export class UserController {
	static async IncludeUser(req: Request, res: Response, next: NextFunction) {
		const locationString = res.locals.locationString

		try {
			const response = await axios.get(`${AUTH0.DOMAIN}/userinfo`, {
				headers: {
					Authorization: req.headers.authorization
				}
			})

			let theUser = await userRepo.createQueryBuilder('user')
				.addSelect("ST_AsText(user.location) AS user_location")
				.leftJoinAndSelect("user.profile", "userProfile")
				.leftJoinAndSelect("user.privacy", "privacySetting")
				.where('user.sub = :sub', { sub: response.data.sub })
				.getOne()


			if (!theUser) {
				const profile = await userProfileRepo.create({})
				const privacy = await privacyRepo.create({})

				await userProfileRepo.save(profile)
				await privacyRepo.save(privacy)

				const result = await Database.query(`
					INSERT INTO
					user (sub, email, location)
					VALUES ("${response.data.sub}", "${response.data.email}", ${locationString})
				`)

				if (result.affectedRows === 0) return next("something went wrong")

				await Database.query(`UPDATE user SET profileId=${profile.id} WHERE sub="${response.data.sub}"`)
				await Database.query(`UPDATE user SET privacyId=${privacy.id} WHERE sub="${response.data.sub}"`)

				theUser = await userRepo.createQueryBuilder('user')
					.addSelect("ST_AsText(user.location) AS user_location")
					.leftJoinAndSelect("user.profile", "userProfile")
					.leftJoinAndSelect("user.privacy", "privacySetting")
					.where('user.sub = :sub', { sub: response.data.sub })
					.getOne()

				if (!theUser) return next("something went wrong")
			}

			await Database.query(`UPDATE user SET location=${locationString} WHERE sub="${response.data.sub}"`)

			res.locals.user = theUser

			next()
		} catch (err: any) {
			// console.log(err)
			logger.debug(err.message)
			res.sendStatus(401)
		}
	}

	async getMyProfile(req: Request, res: Response) {
		logger.debug(`get my profile request ${req.url}`)
		const user = res.locals.user as User

		goodRequest(res, [
			"profile",
			user
		])
	}

	async getUserProfile(req: Request, res: Response) {
		logger.debug(`get user profile request ${req.url}`)
		const sub = req.query.sub as string

		const user = await userRepo.findOne({
			where: { sub },
			relations: ["profile"]
		})

		if (!user) return noGoodRequest(res, "no user found")

		goodRequest(res, [
			"profile",
			user
		])
	}

	async updateMyProfile(req: Request, res: Response) {
		logger.debug(`update user profile request ${req.url}`)
		const user = res.locals.user as User

		const { first_name, last_name, birthday, marital_status, interests, nationality } = req.body
		let updated = false

		if (first_name) {
			user.profile.firstName = first_name
			updated = true
		}

		if (last_name) {
			user.profile.lastName = last_name
			updated = true
		}

		if (isValid(new Date(birthday))) {
			user.profile.birthday = new Date(birthday)
			updated = true
		}

		if (marital_status) {
			user.profile.maritalStatus = marital_status
			updated = true
		}

		if (interests) {
			user.profile.interests = []
			interests.split(",").forEach((item: string) => user.profile.interests.push(item))
			user.profile.interests = Array.from(new Set(user.profile.interests))
			updated = true
		}

		if (getCode(nationality)) {
			user.profile.nationality = nationality
			updated = true
		}

		if (req.file) {
			const profile_picture = req.file as Express.Multer.File

			if (profile_picture) {
				user.profile.profilePicturePath = profile_picture.filename
				updated = true
			}
		}

		user.profile.isNew = !updated

		await userProfileRepo.save(user.profile)

		goodRequest(res)
	}

	async isNew(req: Request, res: Response) {
		logger.debug(`is new request: ${req.url}`)
		const user = res.locals.user as User

		if (user.profile.isNew) goodRequest(res)
		else noGoodRequest(res)
	}
}

export default new UserController()