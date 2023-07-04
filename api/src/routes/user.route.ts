import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import user from "../controller/user";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeUser } from "../middleware/include_user";
import { IncludeLocation } from "../middleware/include_location";
import profile from "../controller/user/profile";
import { checkSchema, query } from "express-validator"
import { upload } from "../lib/file_upload";
import { Gender, MaritalStatus, Privacy } from "../entity";

export default class UserRoute extends RouteConfig {
	profile: Router

	constructor(app: Application) {
		super(app, "User Route")
	}

	registerRoute(): void {
		this.profile = Router()

		this.router.use(IncludeLocation)

		this.router.use("/profile", this.profile) // ---> api/user/profile

		this.app.use("/api/user", this.router) // ---> api/user
	}

	configureRoutes(): void {
		/**
		 * URL: api/user/is-new-user
		 *	 - GET: Checks if the user hasnt updated their profile yet
		 *	 		- jwt check
		 *	 		- include user object
		 * 
		 */
		this.router.route("/is-new-user")
			.get(jwtCheck, IncludeUser, user.isNewUser)


		/**
		 * URL: api/user/profile
		 * 	- POST: Return user profile data for other user
		 * 			- query validation: query
		 */
		this.profile.route("/")
			.get(query('user_sub').isString().notEmpty().escape(), profile.readOtherProfile)
			
			
		/**
		 * URL: api/user/profile/self
		 * 	- GET: Return user profile data
		 * 			- jwt check
		 * 			- include user object
		 * 
		 * 	- POST: Updates the user's profile
		 * 			- jwt check
		 * 			- include user object
		 * 			- multer single file upload (profile_picture)
		 * 			- body validation: check schema
		 * 				- first_name:
		 * 				- last_name:
		 * 				- gender:
		 * 				- birthday:
		 * 				- marital_status:
		 * 				- nationality:
		 * 				- profile_privacy:
		 * 				- interests:
		 * 
		 */
		this.profile.route("/self")
			.get(jwtCheck, IncludeUser, profile.readSelfProfile)
			.put(
				jwtCheck, IncludeUser,
				upload.single('profile_picture'),
				checkSchema({
					first_name: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					last_name: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					gender: {
						notEmpty: true, optional: true, isIn: {
							options: Object.values(Gender)
						},
						escape: true
					},
					birthday: { notEmpty: true, optional: true, isDate: true, escape: true },
					marital_status: {
						notEmpty: true, optional: true, isIn: {
							options: Object.values(MaritalStatus)
						},
						escape: true
					},
					nationality: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					profile_privacy: {
						notEmpty: true, optional: true, isIn: {
							options: Object.values(Privacy)
						},
						escape: true
					},
					interests: {
						notEmpty: true, optional: true, isString: true, escape: true
					}
				}, ['body']),
				profile.updateSelfProfile
			)
	} // configure routes
}