import { connectedUsers } from "..";
import { io } from "../..";
import { Notification } from "../../entity/misc/notification.entity";
import { User } from "../../entity/user/user.entity";
import logger from "../../lib/logger";

export default function sendNotification(user: User, notification: Notification) {
	logger.debug(`sending notification: ${notification.id}`)

	console.log(connectedUsers.map(u => u.socketId + " " + u.sub))
	
	connectedUsers.forEach(connectedUser => {
		if (connectedUser.sub === user.sub) {
			io.to(connectedUser.socketId).emit("new_notification", { notification })
			logger.debug(`notification sent to ${connectedUser.socketId}`)
		}
	})
}