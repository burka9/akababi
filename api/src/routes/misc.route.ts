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
		this.router.use("/category", this.category) // ---> api/misc/category
		this.router.use("/reaction", this.reaction) // ---> api/misc/reaction
		this.app.use("/api/misc", this.router) // ---> api/misc
	}

	configureRoutes(): void {
		/**
		 * URL: api/misc/interest
		 * 	- GET: read the list of interests
		 * 			- query validation: query
		 * 				- interest_id: filter interests by id
		 * 				- interest_name: filter interests by name
		 * 
		 * 	- POST: create new interest object
		 * 			- body validation: body
		 * 				- interest_name: the name for the new object
		 * 
		 * 	- PUT: edit interest object
		 * 			- body validation: body
		 * 				- interest_id: used to find the interest object
		 * 				- interest_name: the new name for the object
		 * 
		 * 	- DELETE: delete interest object
		 * 			- body validation: body
		 * 				- interest_id: used to find the interest object
		 * 
		 */
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


		/**
		 * URL: api/misc/category
		 * 	- GET: read the list of categories
		 * 			- query validation: query
		 * 				- category_id: filter categorys by id
		 * 				- category_name: filter categorys by name
		 * 
		 * 	- POST: create new category object
		 * 			- body validation: body
		 * 				- category_name: the name for the new object
		 * 
		 * 	- PUT: edit category object
		 * 			- body validation: body
		 * 				- category_id: used to find the category object
		 * 				- category_name: the new name for the object
		 * 
		 * 	- DELETE: delete category object
		 * 			- body validation: body
		 * 				- category_id: used to find the category object
		 * 
		 */
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


		/**
		 * URL: api/misc/reaction
		 * 	- GET: read the list of reactions
		 * 			- query validation: query
		 * 				- reaction_id: filter reactions by id
		 * 				- reaction_name: filter reactions by name
		 * 
		 * 	- POST: create new reaction object
		 * 			- body validation: body
		 * 				- reaction_name: the name for the new object
		 * 
		 * 	- PUT: edit reaction object
		 * 			- body validation: body
		 * 				- reaction_id: used to find the reaction object
		 * 				- reaction_name: the new name for the object
		 * 
		 * 	- DELETE: delete reaction object
		 * 			- body validation: body
		 * 				- reaction_id: used to find the reaction object
		 * 
		 */
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