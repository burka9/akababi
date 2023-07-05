import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../lib/errors";
import { AUTH0, OFFLINE, OFFLINE_AUTH_URL } from "../lib/env";
import { userRepo } from "../controller/user";
import { User } from "../entity/user/user.entity";
import { createNewUser } from "../controller/user/static";
import logger from "../lib/logger";
import { LocationType } from "../entity";

interface Auth0UserInfo {
	sub: string,
	nickname: string,
	name: string,
	picture: string,
	updated_at: string,
	email: string,
	email_verified: boolean
}

// fetch user info from auth0 server
const getUserInfo = async (Authorization: string): Promise<Auth0UserInfo> => {
	const { data } = await axios.get(`${OFFLINE ? OFFLINE_AUTH_URL : AUTH0.DOMAIN}/userinfo`, {
		headers: { Authorization }
	})

	return data
}

const createUserIfNotExists = async (userinfo: Auth0UserInfo, location: LocationType): Promise<User> => {
	// fetch user data from database
	let user = await userRepo.findOne({
		where: { sub: userinfo.sub },
		relations: ["profile", "profile.profilePicture.picture", "pictureCategories"]
	})

	// create new user
	if (!user) {
		user = new User()
		user.sub = userinfo.sub
		user.email = userinfo.email
		user.location = location

		await createNewUser(user)
	} else {
		user.location = location
		await userRepo.save(user)
	}

	return user
}

export const IncludeUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await getUserInfo(req.headers.authorization as string)

		if (!data.sub) throw new Unauthorized()

		res.locals.user = await createUserIfNotExists(data, res.locals.location)

		next()
	} catch (err: any) {
		logger.error(err.message)
		throw err
	}
}

export const IncludeUserWithoutAuthorization = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await getUserInfo(req.headers.authorization as string)

		if (data.sub) {
			res.locals.user = await createUserIfNotExists(data, res.locals.location)
		}
	} catch { }

	next()
}