import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import discoverController from "../controller/discover.controller";

export default class DiscoverRoutes extends RouteConfig {
	constructor(app: Application) {
		super(app, "Discover Routes")
	}

	registerRoute(): void {
		this.app.use("/api/discover", this.router)
	}

	configureRoutes(): void {
		this.router.route("/user")
			.get(discoverController.discoverUser)
	}
}