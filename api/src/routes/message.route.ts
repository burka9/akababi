import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeLocation } from "../middleware/include_location";
import { IncludeUser } from "../middleware/include_user";
import message from "../controller/message";
import { upload } from "../lib/file_upload";
import { checkSchema, query } from "express-validator";

export default class MessageRoute extends RouteConfig {
	conversation: Router

	constructor(app: Application) {
		super(app, "Message Route")
	}

	registerRoute(): void {
		this.conversation = Router()
		
		this.router.use(IncludeLocation)

		this.router.use("/conversation", this.conversation)

		this.app.use("/api/message", this.router)
	}

	configureRoutes(): void {
		/**
		 * URL: api/message/conversation
		 * 	- GET: get my conversations
		 * 			- jwt check
		 * 			- include user
		 * 	
		 */
		this.conversation.route("/")
			.get(jwtCheck, IncludeUser, message.getConversations)
		
		/**
		 * URL: api/message/conversation/single
		 * 	- GET: get a single conversation thread
		 * 			- jwt check
		 * 			- include user
		 * 			- query validation: query
		 * 				- to
		 */
		this.conversation.route("/single")
			.get(jwtCheck, IncludeUser, query("to").notEmpty().escape(), message.getSingleConversation)

		/**
		 * URL: api/message/send
		 * 	- POST: sends a message to user
		 * 			- jwt check
		 * 			- include user
		 * 			- multer multiple file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- to
		 * 				- text
		 */
		this.router.route("/send")
			.post(jwtCheck, IncludeUser, upload.fields([
				{ name: 'image', maxCount: 10 },
				{ name: 'audio', maxCount: 10 },
				{ name: 'video', maxCount: 10 },
			]), checkSchema({
				to: { isString: true, notEmpty: true, escape: true },
				text: { isString: true, notEmpty: true, optional: true, escape: true },
			}), message.sendMessage)

		/**
		 * URL: api/message/reply
		 * 	- POST: reply to a message
		 * 			- jwt check
		 * 			- include user
		 * 			- multer multiple file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- to
		 * 				- text
		 * 				- message_id
		 */
		this.router.route("/reply")
			.post(jwtCheck, IncludeUser, upload.fields([
				{ name: 'image', maxCount: 1 },
				{ name: 'audio', maxCount: 1 },
				{ name: 'video', maxCount: 1 },
			]), checkSchema({
				to: { isString: true, notEmpty: true, escape: true },
				text: { isString: true, notEmpty: true, optional: true, escape: true },
				message_id: { isString: true, notEmpty: true, escape: true },
			}), message.replyToMessage)

		/**
		 * URL: api/message/forward
		 * 	- POST: forward a message
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- to
		 * 				- message_id
		 */
		this.router.route("/forward")
			.post(jwtCheck, IncludeUser, checkSchema({
				to: { isString: true, notEmpty: true, escape: true },
				message_id: { isString: true, notEmpty: true, escape: true },
			}), message.forwardMessage)

		/**
		 * URL: api/message/delete
		 * 	- DELETE: delete a message
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- message_id
		 */
		this.router.route("/delete")
			.delete(jwtCheck, IncludeUser, checkSchema({
				message_id: { isString: true, notEmpty: true, escape: true },
			}), message.deleteMessage)

		/**
		 * URL: api/message/edit
		 * 	- PUT: edit a message
		 * 			- jwt check
		 * 			- include user
		 * 			- multer multiple file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- message_id
		 * 				- text
		 */
		this.router.route("/edit")
			.put(jwtCheck, IncludeUser, upload.fields([
				{ name: 'image', maxCount: 1 },
				{ name: 'audio', maxCount: 1 },
				{ name: 'video', maxCount: 1 },
			]), checkSchema({
				message_id: { isString: true, notEmpty: true, escape: true },
				text: { isString: true, notEmpty: true, optional: true, escape: true },
			}), message.editMessage)

		/**
		 * URL: api/message/read
		 * 	- POST: mark a message as read
		 * 			- jwt check
		 * 			- include user
		 * 			- body validation: check schema
		 * 				- message_id
		 */
		this.router.route("/read")
			.post(jwtCheck, IncludeUser, checkSchema({
				message_id: { isString: true, notEmpty: true, escape: true },
			}), message.markAsRead)
	}
}