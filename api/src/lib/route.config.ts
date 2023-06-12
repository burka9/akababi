import { Application, Router } from "express";

export abstract class RouteConfig {
	app: Application
	name: string
	router: Router

	constructor(app: Application, name: string) {
		this.app = app
		this.name = name
		this.router = Router()
		this.registerRoute()
		this.configureRoutes()
	}

	getName(): string {
		return this.name
	}

	abstract registerRoute(): void
	abstract configureRoutes(): void
}
