import { Application } from "express";
import { RouteConfig } from "../lib/route.config";
import sms from "../controller/sms";
import { body } from "express-validator";

export default class SMSRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, "SMS Route")
	}

	registerRoute(): void {
		this.app.use("/sms", this.router)
	}

	configureRoutes(): void {
		/**
		 * URL: /sms/send
		 * 	- POST: send an otp sms to a user
		 * 			- body validation: body
		 * 				- recipient
		 * 				- body
		 */
		this.router.route("/send")
			.post(body(["recipient", "body"]).notEmpty(), sms.sendSMS)
		
		/**
		 * URL: /sms/verify
		 * 	- POST: verify an otp from auth0 server and send back the response
		 * 			- body validation: body
		 * 				- username
		 * 				- otp
		 */
		this.router.route("/verify")
			.post(body(["username", "otp"]).notEmpty(), sms.verifyOTP)
	}
}