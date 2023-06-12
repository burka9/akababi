import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import userController, { UserController } from "../controller/user.controller";
import { profileUpload } from "../lib/upload";
import { jwtCheck } from "../middleware";

export default class UserRoutes extends RouteConfig {
	constructor(app: Application) {
		super(app, "User Routes")
	}

	registerRoute(): void {
		this.app.use("/api/user", this.router)
	}

	configureRoutes(): void {
		this.router.route("/profile")
			.get(jwtCheck, UserController.IncludeUser, userController.getMyProfile)
			.put(jwtCheck, UserController.IncludeUser, profileUpload.single('profile_picture'), userController.updateMyProfile)

		this.router.route("/get-user-profile")
			.get(userController.getUserProfile)

		this.router.route("/profile/is-new")
			.get(jwtCheck, UserController.IncludeUser, userController.isNew)
	}
}