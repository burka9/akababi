import { Server } from "socket.io"
import logger from "../lib/logger"
import { createUserIfNotExists, getUserInfo } from "../middleware/include_user"
import { implementListener } from "./static";

export interface ConnectedUsers {
	sub: string;
	id: string;
	connectedAt: Date;
}

export const connectedUsers: ConnectedUsers[] = []

export default (io: Server) => {
	io.on("connection", async socket => {
		try {
			const { handshake } = socket
			const location = JSON.parse(handshake.headers.coordinates as string)
			const info = await getUserInfo(handshake.headers.authorization as string)
			if (!location || !info.sub) throw new Error()

			const user = await createUserIfNotExists(info, location)
			if (!user) throw new Error()

			// user is connected
			logger.debug(`socket connected: ${socket.id} (${location.latitude}, ${location.longitude})`)
			
			// add to connected list
			connectedUsers.push({
				sub: user.sub,
				id: socket.id,
				connectedAt: new Date()
			})

			// listeners
			implementListener(socket)
		} catch (err: any) {
			logger.error(`socket error: ${err.message}`)
			socket.disconnect(true)
		}
	})
}
