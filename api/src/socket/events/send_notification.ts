import { readFileSync } from "fs";
import { connectedUsers } from "..";
import { io } from "../..";
import { Notification } from "../../entity/misc/notification.entity";
import { User } from "../../entity/user/user.entity";
import logger from "../../lib/logger";
import { resolve } from "path";
import admin from "firebase-admin";
import { NotificationType } from "../../entity";
import { generateNotificationText } from "../../controller/notification/static";
import { PATH } from "../../lib/env";

export default function sendNotification(user: User, notification: Notification) {
	logger.debug(`sending notification: ${notification.id}`)
	
	connectedUsers.forEach(connectedUser => {
		if (connectedUser.sub === user.sub) {
			io.to(connectedUser.socketId).emit("new_notification", { notification })
			logger.debug(`notification sent to ${connectedUser.socketId}`)
		}
	})

	// send firebase notification
	if (user.firebaseToken) {
		sendFirebaseNotification(user, notification)
	}
}

const serviceAccount = readFileSync(resolve(PATH.CUSTOM, "serviceAccount.json"))

const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(serviceAccount.toString())),
})

const getTitle = (notification: Notification) => {
	switch (notification.type) {
		case NotificationType.NewFollower:
			return "New Follower"
			break
		case NotificationType.NewMessage:
			return "New Message"
			break
		case NotificationType.PostComment:
			return "New Comment"
			break
		case NotificationType.PostReaction:
			return "New Reaction"
			break
		case NotificationType.PostShare:
			return "New Share"
			break
	}
}

const sendFirebaseNotification = (user: User, notification: Notification) => {
	firebaseAdmin.messaging().send({
		token: user.firebaseToken,
		notification: {
			title: getTitle(notification),
			body: generateNotificationText(notification.type, notification.user.profile.firstName, notification.user.profile.lastName),
		},
	})
}