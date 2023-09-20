import { groupMemberRepo, groupRepo } from ".";
import { Group } from "../../entity/group/group.entity";
import { GroupMembers } from "../../entity/group/group_members.entity";
import { User } from "../../entity/user/user.entity";

const addMember = async (group_id: number, user_sub: string): Promise<Group> => {
	const group = await groupRepo.findOneOrFail({
		where: { id: group_id },
		relations: ["group_rule", "parent"]
	})

	const member = new GroupMembers()
	member.group = group.id
	member.user = user_sub

	return group
}

export const addUserToGroup = async (user: User, group_id: number): Promise<Group[]> => {
	const group = await addMember(group_id, user.sub)

	const joinedGroups: Group[] = [group]

	// add user to all parent groups
	let parent: Group | null = group.parent

	while (parent !== null) {
		try {
			parent = await addMember(group.parent.id, user.sub)
			joinedGroups.push(parent)
		} catch {
			parent = null
		}
	}

	return joinedGroups
}
