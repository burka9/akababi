import { Application } from "express";
import { RouteConfig } from "../../lib/route.config";
import postController, { PostController } from "../../controller/post.controller";
import { jwtCheck } from "../../middleware";
import { UserController } from "../../controller/user.controller";
import { commentUpload, postUpload } from "../../lib/upload";

export default class PostRoutes extends RouteConfig {
	constructor(app: Application) {
		super(app, "Post Routes")
	}

	registerRoute(): void {
		this.app.use("/api/post", this.router)
	}

	configureRoutes(): void {
		this.router.route("/")
			.get(postController.getAllPosts)
			.post(jwtCheck, UserController.IncludeUser, postUpload.fields([
				{ name: 'image', maxCount: 5 },
				{ name: 'audio', maxCount: 5 },
				{ name: 'video', maxCount: 5 },
			]), postController.createPost)

		this.router.param('postId', PostController.IncludePost)

		this.router.route('/:postId')
			.get(postController.getSinglePost)

		this.router.route("/comment/:postId")
			.get(postController.getPostComments)
			.post(jwtCheck, UserController.IncludeUser, commentUpload.fields([
				{ name: 'image', maxCount: 1 },
				{ name: 'audio', maxCount: 1 },
				{ name: 'video', maxCount: 1 },
			]), postController.commentOnPost)

		this.router.route("/reaction/:postId")
			.get(postController.getPostReactions)
			.post(jwtCheck, UserController.IncludeUser, postController.reactToPost)
	}
}