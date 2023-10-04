import { connectedUsers } from "..";
import { io } from "../..";
import logger from "../../lib/logger";

export default function readMessage(sub: string, messageId: number) {
	logger.debug(`read message`)

	connectedUsers.forEach(connectedUser => {
		if (connectedUser.sub === sub) {
			io.to(connectedUser.socketId).emit("read_message", { messageId })
			logger.debug(`message read sent to ${connectedUser.socketId}`)
		}
	})
}