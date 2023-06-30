import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import misc from "../controller/misc";
import { query, body, checkSchema } from "express-validator"

export default class MiscRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, "Misc Route")
	}

	registerRoute(): void {
		this.app.use("/api/misc", this.router)
	}

	configureRoutes(): void {
		this.router.route("/interest")
			.get(
				query(['interest_id', 'interest_name']).escape(),
				misc.readInterest
			)
			.post(
				body(["interest_name"]).notEmpty().escape(),
				misc.createInterest
			)
			.put(
				body(["interest_id", "interest_name"]).notEmpty().escape(),
				misc.updateInterst
			)
			.delete(
				body("interest_id").isNumeric().notEmpty().escape(),
				misc.removeInterest
			)
	}
}