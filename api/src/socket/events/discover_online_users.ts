import { Socket } from "socket.io"
import { connectedUsers } from ".."

export default (socket: Socket, data: any[]) => {
	console.log(data)
	socket.emit("discover_online_users", { connectedUsers })
}