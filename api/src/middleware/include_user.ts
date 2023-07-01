import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../lib/errors";
import { AUTH0 } from "../lib/env";
import { userRepo } from "../controller/user";
import { User } from "../entity/user/user.entity";
import { createNewUser } from "../controller/user/static";
import logger from "../lib/logger";

export const IncludeUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// fetch user info from auth0 server
		const { data } = await axios.get(`${AUTH0.DOMAIN}/userinfo`, {
			headers: { Authorization: req.headers.authorization }
		})

		if (!data.sub) throw new Unauthorized()
		
		// fetch user data from database
		let user = await userRepo.findOne({
			where: { sub: data.sub },
			relations: ["profile", "profile.profilePicture.picture", "pictureCategories"]
		})
		
		// create new user
		if (!user) {
			user = new User()
			user.sub = data.sub
			user.email = data.email
			user.location = res.locals.location
			
			await createNewUser(user)
		} else {
			user.location = res.locals.location
			await userRepo.save(user)
		}

		// attach the user object
		res.locals.user = user
		
		next()
	} catch(err: any) {
		logger.error(err.message)
		throw err
	}
}