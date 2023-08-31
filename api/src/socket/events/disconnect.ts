import { Socket } from "socket.io"
import { connectedUsers } from ".."
import { userRepo } from "../../controller/user"
import logger from "../../lib/logger"

export default async (socket: Socket) => {
	const index = connectedUsers.findIndex(user => user.socketId === socket.id)
	if (index >= 0) {
		const user = await userRepo.findOneBy({ sub: connectedUsers[index].sub })
		if (!user) return logger.debug(`user not found: ${connectedUsers[index].sub}`)
		
		user.lastOnline = new Date()

		await userRepo.save(user)
		
		connectedUsers.splice(index, 1)
	}

	logger.debug(`socket disconnected: ${socket.id}`)
}