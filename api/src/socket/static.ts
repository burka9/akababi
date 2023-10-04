import { Socket } from "socket.io";
import disconnect from "./events/disconnect";
import { User } from "../entity/user/user.entity";
import { ConnectedUsers } from ".";
import check_online_user from "./events/check_online_user";
import { io } from "..";

interface IsTyping {
	socket_id?: string;
	sub: string;
}

export const implementListener = (socket: Socket, user: User, connectedUsers: ConnectedUsers[]) => {
	socket.on("disconnect", () => disconnect(socket))

	socket.on("check_online_users", async (data: string[]) => check_online_user(socket, data, user, connectedUsers))
	socket.on('is_typing', (data: IsTyping) => {
		const { socket_id, sub } = data

		const ids = connectedUsers.filter(u => u.sub === sub).map(u => u.socketId)
		
		for (const id of ids) {
			io.to(id).emit('is_typing', user.sub)
		}
	})
}