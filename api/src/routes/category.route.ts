import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import categoryController from "../controller/category.controller";

export default class CategoryRoutes extends RouteConfig {
	constructor(app: Application) {
		super(app, "Category Routes")
	}

	registerRoute(): void {
		this.app.use("/api/category", this.router)
	}

	configureRoutes(): void {
		this.router.route("/")
			.get(categoryController.getCategories)
	}
}
