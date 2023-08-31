import { notificationRepo } from "."
import { NotificationType } from "../../entity"
import { Message } from "../../entity/misc/message.entity"
import { Notification } from "../../entity/misc/notification.entity"
import { Post } from "../../entity/post/post.entity"
import { PostComment } from "../../entity/post/post_comment.entity"
import { PostReaction } from "../../entity/post/post_reaction.entity"
import { User } from "../../entity/user/user.entity"
import logger from "../../lib/logger"
import sendNotification from "../../socket/events/send_notification"

export const newNotification = async (
	owner: User,
	type: NotificationType,
	user: User,
	post?: Post | null,
	postComment?: PostComment | null,
	postReaction?: PostReaction | null,
	message?: Message | null,
): Promise<Notification> => {
	logger.debug(`new notification: ${type}`)
	
	const notification = new Notification()
	notification.type = type
	notification.owner = owner
	notification.user = user

	switch (type) {
		case NotificationType.NewFollower:
			break
		case NotificationType.PostComment:
			notification.postComment = postComment as PostComment
			notification.post = post as Post
			break
		case NotificationType.PostReaction:
			notification.postReaction = postReaction as PostReaction
			notification.post = post as Post
			break
		case NotificationType.PostShare:
			notification.post = post as Post
			break
		case NotificationType.NewMessage:
			notification.message = message as Message
			break
		default:
	}

	await notificationRepo.save(notification)
	sendNotification(owner, notification)

	return notification
}

export const generateNotificationText = (type: NotificationType, firstName: string, lastName: string): string => {
	let text: string
	
	switch (type) {
		case NotificationType.NewFollower:
			text = `${firstName} ${lastName} has started following you.`
			break
		case NotificationType.NewMessage:
			text = `You have a new message from ${firstName} ${lastName}.`
			break
		case NotificationType.PostComment:
			text = `${firstName} ${lastName} has commented on your post.`
			break
		case NotificationType.PostReaction:
			text = `${firstName} ${lastName} has reacted on your post.`
			break
		case NotificationType.PostShare:
			text = `${firstName} ${lastName} has shared your post.`
		default:
			text = ``
	}

	return text
}