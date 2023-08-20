import { Socket } from "socket.io";
import disconnect from "./events/disconnect";
import discover_online_users from "./events/discover_online_users";

export const implementListener = (socket: Socket) => {
	socket.on("disconnect", () => disconnect(socket))
	socket.on("discover_online_users", (...data) => discover_online_users(socket, data))
}