import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import discover from "../controller/discover";
import { IncludeLocation } from "../middleware/include_location";
import { query } from "express-validator";
import { Gender } from "../entity";
import { IncludeUserWithoutAuthorization } from "../middleware/include_user";

export default class DiscoverRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, "Discover Route")
	}

	registerRoute(): void {
		this.router.use(IncludeLocation)

		this.app.use("/api/discover", this.router) // ---> api/discover
	}

	configureRoutes(): void {
		/**
		 * URL: api/discover
		 * 	- GET: returns users, posts and groups within a certain radius of the request
		 */
		this.router.route("/")
			.get(IncludeUserWithoutAuthorization, discover.discoverAll)

		/**
		 * URL: api/discover/user
		 * 	- GET: returns users within a certain radius of the request
		 * 			- query validation: query
		 * 				- gender: filter either male or female users
		 */
		this.router.route("/user")
			.get(IncludeUserWithoutAuthorization, query('gender').optional().isIn(Object.values(Gender)).escape(), discover.discoverUser)

		/**
		 * URL: api/discover/post
		 * 	- GET: returns posts within a certain radius of the request
		 */
		this.router.route("/post")
			.get(IncludeUserWithoutAuthorization, discover.discoverPost)

		/**
		 * URL: api/discover/group
		 * 	- GET: returns groups within a certain radius of the request
		 */
		this.router.route("/group")
			.get(IncludeUserWithoutAuthorization, discover.discoverGroup)
	}
}