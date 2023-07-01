import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import misc from "../controller/misc";
import { query, body } from "express-validator"
import interest from "../controller/misc/interest";
import category from "../controller/misc/category";
import reaction from "../controller/misc/reaction";

export default class MiscRoute extends RouteConfig {
	interest: Router;
	category: Router;
	reaction: Router;

	constructor(app: Application) {
		super(app, "Misc Route")
	}

	registerRoute(): void {
		this.interest = Router()
		this.category = Router()
		this.reaction = Router()

		this.router.use("/interest", this.interest) // ---> api/misc/interest
		this.router.use("/category", this.category) // ---> api/misc/interest
		this.router.use("/reaction", this.reaction) // ---> api/misc/reaction
		this.app.use("/api/misc", this.router) // ---> api/misc
	}

	configureRoutes(): void {
		this.interest.route("/")
			.get(
				query(['interest_id', 'interest_name']).escape(),
				interest.readInterest
			)
			.post(
				body(["interest_name"]).notEmpty().escape(),
				interest.createInterest
			)
			.put(
				body(["interest_id", "interest_name"]).notEmpty().escape(),
				interest.updateInterest
			)
			.delete(
				body("interest_id").isNumeric().notEmpty().escape(),
				interest.removeInterest
			)

		this.category.route("/")
			.get(
				query(['category_id', 'category_name']).escape(),
				category.readCategory
			)
			.post(
				body(["category_name"]).notEmpty().escape(),
				category.createCategory
			)
			.put(
				body(["category_id", "category_name"]).notEmpty().escape(),
				category.updateCategory
			)
			.delete(
				body("category_id").isNumeric().notEmpty().escape(),
				category.removeCategory
			)

		this.reaction.route("/")
			.get(
				query(['reaction_id', 'reaction_name']).escape(),
				reaction.readReaction
			)
			.post(
				body(["reaction_name"]).notEmpty().escape(),
				reaction.createReaction
			)
			.put(
				body(["reaction_id", "reaction_name"]).notEmpty().escape(),
				reaction.updateReaction
			)
			.delete(
				body("reaction_id").isNumeric().notEmpty().escape(),
				reaction.removeReaction
			)
	}
}