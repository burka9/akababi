import { Socket } from "socket.io";
import { ConnectedUsers } from "..";
import { Privacy } from "../../entity";
import { userRepo } from "../../controller/user";
import { User } from "../../entity/user/user.entity";

export default async function (socket: Socket, data: string[], user: User, connectedUsers: ConnectedUsers[]) {
	const list: { sub: string; active: boolean; last_active: string, socket_id: string; }[] = []
		
		if (user.onlineStatusPrivacy === Privacy.OnlyMe) {
			socket.emit("check_online_users", list)
			return
		}
		
		for await (const sub of data) {
			const _user = await userRepo.findOneBy({ sub })
			if (!_user) continue

			if (user.onlineStatusPrivacy === Privacy.Followers && !(await _user.isFollowerOf(user))) continue
			if (_user.onlineStatusPrivacy === Privacy.Followers && !(await user.isFollowerOf(_user))) continue
			if (_user.onlineStatusPrivacy === Privacy.OnlyMe) continue

			list.push({
				socket_id: socket.id,
				sub: _user.sub,
				active: connectedUsers.some(u => u.sub === _user.sub),
				last_active: _user.lastOnline?.toISOString() || "",
			})
		}

		socket.emit("check_online_users", list)
}