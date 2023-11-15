import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import { IncludeLocation } from "../middleware/include_location";
import { jwtCheck } from "../middleware/jwt_check";
import { upload } from "../lib/file_upload";
import { checkSchema } from "express-validator";
import { IncludeUser } from "../middleware/include_user";
import group from "../controller/group";

export default class GroupRoute extends RouteConfig {

	constructor(app: Application) {
		super(app, "Group Route")
	}

	registerRoute(): void {
		this.router.use(IncludeLocation)

		this.app.use("/api/group", this.router)
	}

	configureRoutes(): void {
		/**
		 * URL: api/group/admin/:group_id
		 * 	- POST: post to group
		 * 			- jwt check
		 * 			- include user
		 * 			- include group
		 * 			- multer multiple file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- text
		 * 				- category_id
		 * 				- group_id
		 * 
		 */
		// this.router.route("/post")
		// 	.post(jwtCheck, upload.fields([
		// 		{ name: 'image', maxCount: 10 },
		// 		{ name: 'audio', maxCount: 10 },
		// 		{ name: 'video', maxCount: 10 },
		// 	]), checkSchema({
		// 		text: { optional: true, isString: true, escape: true },
		// 		category_id: { optional: true, isNumeric: true, escape: true },
		// 		group_id: { optional: false, isNumeric: true, escape: true },
		// 	}), IncludeUser, IncludeGroup, group.postToGroup)

		this.router.route("/create-group")
			.post(jwtCheck, upload.single("picture"), checkSchema({
				name: { optional: false, isString: true },
				description: { optional: true, isString: true },
				post_privacy: { optional: true, isString: true },
				member_privacy: { optional: true, isString: true },
				parent_id: { optional: true, isNumeric: true },
				nationality: { optional: true, isJSON: true },
				country: { optional: true, isJSON: true },
				state: { optional: true, isJSON: true },
				city: { optional: true, isJSON: true },
			}), IncludeUser, group.createGroup)
	}
}