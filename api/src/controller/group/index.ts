import { Request, Response } from "express";
import { User } from "../../entity/user/user.entity";
import { matchedData, validationResult } from "express-validator";
import { BadFields, NoItem } from "../../lib/errors";
import { Database } from "../../database";
import { Group } from "../../entity/group/group.entity";
import { GroupMembers } from "../../entity/group/group_members.entity";
import { addUserToGroup } from "./static";
import { goodRequest } from "../../lib/response";

export const groupRepo = Database.getRepository(Group)
export const groupMemberRepo = Database.getRepository(GroupMembers)

class GroupController {
	async joinGroup(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { group_id } = matchedData(req)

		const joinedGroups = addUserToGroup(user, group_id)

		goodRequest(res, { joinedGroups })
	}

	async getAllMyGroups(req: Request, res: Response) {
		const user = res.locals.user as User

		const groups = await groupMemberRepo.find({
			where: {
				user: user.sub
			},
			relations: ["group"]
		})

		goodRequest(res, { groups })
	}

	async leaveGroup(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { group_id } = matchedData(req)

		const member = await groupMemberRepo.findOneBy({
			user: user.sub,
			group: group_id
		})
		if (!member) throw new NoItem("User in group")

		await groupMemberRepo.remove(member)

		goodRequest(res)
	}
}

export default new GroupController()