import { Socket } from "socket.io"
import { connectedUsers } from ".."

export default (socket: Socket) => {
	const index = connectedUsers.findIndex(user => user.id === socket.id)
	if (index >= 0) connectedUsers.splice(index, 1)
	console.log(`socket disconnected: ${socket.id}`)
}