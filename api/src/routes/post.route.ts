import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import { IncludeLocation } from "../middleware/include_location";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeUser } from "../middleware/include_user";
import post from "../controller/post";
import { upload } from "../lib/file_upload";
import { body, checkSchema } from "express-validator";
import { IncludePost } from "../middleware/include_post";
import comment from "../controller/post/comment";
import reaction from "../controller/post/reaction";

export default class PostRoute extends RouteConfig {
	reaction: Router;
	comment: Router;
	self: Router;

	constructor(app: Application) {
		super(app, "Post Route")
	}

	registerRoute(): void {
		this.reaction = Router()
		this.comment = Router()
		this.self = Router()

		this.router.use(IncludeLocation)

		this.router.use("/reaction", this.reaction) // ---> api/post/reaction
		this.router.use("/comment", this.comment) // ---> api/post/comment
		this.router.use("/self", this.self) // ---> api/post/self

		this.app.use("/api/post", this.router) // ---> api/post
	}

	configureRoutes(): void {
		/**
		 * URL: api/post
		 * 	- GET: get a single post by id
		 * 			- include user
		 * 			- include post
		 * 
		 * 
		 * 	- POST: create new post
		 * 			- jwt check
		 * 			- multer multiple file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- text: the text content of the post (optional)
		 * 				- category_id: the category of the post (optional)
		 * 
		 */
		this.router.route("/")
			.get(IncludePost, post.readSinglePost)
			.post(jwtCheck, upload.fields([
				{ name: 'image', maxCount: 10 },
				{ name: 'audio', maxCount: 10 },
				{ name: 'video', maxCount: 10 },
			]), checkSchema({
				text: { optional: true, isString: true, escape: true },
				category_id: { optional: true, isNumeric: true, escape: true },
			}), IncludeUser, post.createPost)


		/**
		 * URL: api/post/view
		 * 	- GET: increment the view count of a post
		 * 			- include post
		 * 
		 */
		this.router.route("/view")
			.get(IncludePost, post.viewPost)


		/**
		 * URL: api/post/self
		 * 	- GET: Return the user's own posts
		 * 			- jwt check
		 * 			- include user
		 * 
		 */
		this.self.route("/")
			.get(jwtCheck, IncludeUser, post.readSelfPosts)


		/**
		 * URL: api/post/comment
		 * 	- POST: make comment on a post
		 * 			- jwt check
		 * 			- include user
		 * 			- include post
		 * 			- multer single file upload (image, audio, video)
		 * 			- body validation: check schema
		 * 				- text
		 */
		this.router.route("/comment")
			.post(jwtCheck, IncludeUser, IncludePost, upload.fields([
				{ name: 'image', maxCount: 1 },
				{ name: 'audio', maxCount: 1 },
				{ name: 'video', maxCount: 1 },
			]), checkSchema({
				text: { isString: true, optional: true, escape: true },
			}), comment.makeComment)


		/**
		 * URL: api/post/reaction
		 * 	- POST: make a reaction to a post
		 * 			- jwt check
		 * 			- include user
		 * 			- include post
		 * 			- body validation: body
		 * 				- reaction_id
		 */
		this.reaction.route("/")
			.post(jwtCheck, IncludeUser, IncludePost, body('reaction_id').notEmpty().escape(), reaction.reactToPost)
	}
}