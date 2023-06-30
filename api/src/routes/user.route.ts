import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import user from "../controller/user";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeUser } from "../middleware/include_user";
import { IncludeLocation } from "../middleware/include_location";
import profile from "../controller/user/profile";
import { body } from "express-validator"
import { upload } from "../lib/file_upload";

export default class UserRoute extends RouteConfig {
	profile: Router

	constructor(app: Application) {
		super(app, "User Route")
	}

	registerRoute(): void {
		this.profile = Router()
		this.router.use(IncludeLocation)

		this.router.use("/profile", this.profile)
		this.app.use("/api/user", this.router)
	}

	configureRoutes(): void {
		this.router.route("/is-new-user")
			.get(jwtCheck, IncludeUser, user.isNewUser)

		// profile
		this.profile.route("/self")
			.get(jwtCheck, IncludeUser, profile.readSelfProfile)
			.put(
				jwtCheck, IncludeUser,
				upload.single('profilePicture'),
				body("firstName").optional().notEmpty().isAlphanumeric().escape(),
				body("lastName").optional().notEmpty().isAlphanumeric().escape(),
				body("birthday").optional().notEmpty().isDate().escape(),
				body("maritalStatus").optional().notEmpty().isAlpha().escape(),
				body("nationality").optional().notEmpty().isAlpha().escape(),
				body("profilePrivacy").optional().notEmpty().isAlpha().escape(),
				body("interests").optional().isArray().escape(),
				profile.updateSelfProfile
			)
	}
}