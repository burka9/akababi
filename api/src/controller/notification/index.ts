import { Request, Response } from "express"
import { User } from "../../entity/user/user.entity"
import { BadFields, Unauthorized } from "../../lib/errors"
import { Database } from "../../database"
import { Notification } from "../../entity/misc/notification.entity"
import { goodRequest } from "../../lib/response"
import { matchedData, validationResult } from "express-validator"
import { userRepo } from "../user"

export const notificationRepo = Database.getRepository(Notification)

class NotificationController {
	async getNotifications(req: Request, res: Response) {
		const user = res.locals.user as User

		const notifications = await notificationRepo
			// .createQueryBuilder("notification")
			// .leftJoin("notification.user", "user")
			// .leftJoin("notification.owner", "owner")
			// .leftJoin("notification.post", "post")
			// .leftJoin("notification.postComment", "postComment")
			// .leftJoin("notification.postReaction", "postReaction")
			// .leftJoin("notification.message", "message")
			// .leftJoin("user.profile", "profile")
			// .addSelect(["notification.*", "user.*", "owner.*", "post.*", "postComment.*", "postReaction.*", "message.*", "profile.*"])
			// .where("notification.owner = :owner", { owner: user.sub })
			// .orderBy("notification.createdAt", "DESC")
			// .getMany()

			.query(`
				SELECT
					notification.notification_id AS id,
					notification.created_at AS createdAt,
					notification.type,
					notification.is_read AS isRead,

					JSON_OBJECT (
						'sub', owner.user_id,
						'profile', JSON_OBJECT (
							'firstName', owner_profile.first_name,
							'lastName', owner_profile.last_name
						)
					) AS owner,

					JSON_OBJECT (
						'sub', user.user_id,
						'profile', JSON_OBJECT (
							'firstName', user_profile.first_name,
							'lastName', user_profile.last_name
						)
					) AS user,

					JSON_OBJECT (
						'id', post.post_id,
						'createdAt', post.created_at
					) AS post,

					JSON_OBJECT (
						'id', post_comment.post_comment_id,
						'createdAt', post_comment.created_at
					) AS postComment,

					JSON_OBJECT (
						'id', post_reaction.post_reaction_id,
						'createdAt', post_reaction.created_at
					) AS postReaction

				FROM notification

				LEFT JOIN user owner
					ON notification.to_user_id = owner.user_id
				LEFT JOIN user_profile owner_profile
					ON owner.user_profile_id = owner_profile.user_profile_id

				LEFT JOIN user user
					ON notification.user_id = user.user_id
				LEFT JOIN user_profile user_profile
					ON user.user_profile_id = user_profile.user_profile_id

				LEFT JOIN post post
					ON notification.post_id = post.post_id

				LEFT JOIN post_comment post_comment
					ON notification.post_comment_id = post_comment.post_comment_id

				LEFT JOIN post_reaction post_reaction
					ON notification.post_reaction_id = post_reaction.post_reaction_id

				WHERE notification.to_user_id = '${user.sub}'

				ORDER BY notification.created_at DESC
			`)

		goodRequest(res, { notifications })
	}

	async markAsRead(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { notification_id } = matchedData(req)

		if (notification_id) {
			const notification = await notificationRepo.findOneBy({ id: notification_id, user: { sub: user.sub } })
			if (!notification) throw new Unauthorized()

			notification.isRead = true
			await notificationRepo.save(notification)
		} else {
			await notificationRepo.update({ user: { sub: user.sub } }, { isRead: true })
		}

		goodRequest(res)
	}

	async deleteNotification(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { notification_id } = matchedData(req)

		const notification = await notificationRepo.findOneBy({ id: notification_id, user: { sub: user.sub } })
		if (!notification) throw new Unauthorized()

		await notificationRepo.remove(notification)

		goodRequest(res)
	}

	async updateFirebaseToken(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()
		
		const user = res.locals.user as User
		const { firebase_token } = matchedData(req)

		user.firebaseToken = firebase_token

		await userRepo.save(user)

		goodRequest(res)
	}
}

export default new NotificationController()