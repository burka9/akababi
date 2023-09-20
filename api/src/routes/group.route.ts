import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeUser } from "../middleware/include_user";
import group from "../controller/group";
import admin from "../controller/group/admin";
import { checkSchema } from "express-validator";

export default class GroupRoute extends RouteConfig {
	admin: Router;

	constructor(app: Application) {
		super(app, "Group Route")
	}

	registerRoute(): void {
		this.admin = Router()

		this.router.use("/admin", this.admin)

		this.app.use("/group", this.router)
	}

	configureRoutes(): void {
		/**
		 * URL: api/group
		 * 	- GET: get all my groups
		 * 		- jwt check
		 * 		- include user
		 *
		 * 	- POST: join a specific group
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- group_id
		 *
		 * - DELETE: leave a specific group
		 * 			- jwt check
		 *			- include user
		 * 			- body validation: check schema
		 * 				- group_id
		 */
		this.router.route("/")
			.get(jwtCheck, IncludeUser, group.getAllMyGroups)
			.post(jwtCheck, IncludeUser, checkSchema({
				group_id: { isString: true, notEmpty: true, escape: true },
			}), group.joinGroup)
			.delete(jwtCheck, IncludeUser, checkSchema({
				group_id: { isString: true, notEmpty: true, escape: true },
			}), group.leaveGroup)

		/**
		 * URL: api/group/admin
		 * 	- GET: description goes here
		 * 
		 *
		 */
	}
}