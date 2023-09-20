import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import notification from "../controller/notification";
import { body, checkSchema } from "express-validator";
import { IncludeUser } from "../middleware/include_user";
import { jwtCheck } from "../middleware/jwt_check";

export default class NotificationRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, "Notification Route")
	}

	registerRoute(): void {
		this.app.use("/api/notification", this.router)
	}

	configureRoutes(): void {
		/**
		 * URL: api/notification
		 * 	- GET: get all notifications
		 * 			- jwt check
		 * 			- include user
		 * 
		 * 	- PUT: mark all notifications as read
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- notification_id
		 *
		 * 	- DELETE: delete a notification
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- notification_id
		 * 
		 */
		this.router.route("/")
			.get(jwtCheck, IncludeUser, notification.getNotifications)
			.put(jwtCheck, IncludeUser, checkSchema({
				notification_id: {
					in: "body",
					notEmpty: true,
					optional: true,
					escape: true,
				},
			}), notification.markAsRead)
			.delete(jwtCheck, IncludeUser, checkSchema({
				notification_id: {
					in: "body",
					notEmpty: true,
					escape: true,
				},
			}), notification.deleteNotification)

		/**
		 * URL: api/notification/update-firebase-token
		 *	- GET: update firebase token
		 *			- jwt check
		 *			- include user
		 *			- body validation: body
		 *
		 */
		this.router.route("/update-firebase-notification")
			.post(jwtCheck, IncludeUser, body('firebase_token').notEmpty().escape(), notification.updateFirebaseToken)
	}
}