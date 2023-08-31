import { Socket } from "socket.io";
import disconnect from "./events/disconnect";
import { User } from "../entity/user/user.entity";
import { ConnectedUsers } from ".";
import check_online_user from "./events/check_online_user";
import { io } from "..";

export const implementListener = (socket: Socket, user: User, connectedUsers: ConnectedUsers[]) => {
	socket.on("disconnect", () => disconnect(socket))

	socket.on("check_online_users", async (data: string[]) => check_online_user(socket, data, user, connectedUsers))
	socket.on('is_typing', (data: string) => {
		io.to(data).emit('is_typing')
	})
}