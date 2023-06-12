import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import reactionsController from "../controller/reactions.controller";

export default class ReactionRoutes extends RouteConfig {
	constructor(app: Application) {
		super(app, "Reaction Routes")
	}

	registerRoute(): void {
		this.app.use("/api/reaction", this.router)
	}

	configureRoutes(): void {
		this.router.route("/")
			.get(reactionsController.getReactions)
	}
}
