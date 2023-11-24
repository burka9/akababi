import { groupMemberRepo, groupRepo } from ".";
import { Group } from "../../entity/group/group.entity";
import { User } from "../../entity/user/user.entity";
import { decodeLocation } from "../discover/static";

export async function toggleAdmin(group: number, user: string, isAdmin: boolean) {
	try {
		await groupMemberRepo.update({ group, user }, { isAdmin })
	} catch { }
}

export async function addUserToGroup(user: User, group_id: number) {
	const joinedGroups = []

	let group = await groupRepo.findOne({
		where: { id: group_id },
		relations: ["parent", "rule"]
	})

	while (group) {
		try {
			if (await userCanJoinGroup(user, group)) {
				await groupMemberRepo.insert({
					group: group.id,
					user: user.sub,
					isAdmin: false
				})

				joinedGroups.push(group)
			}
		} catch { }

		if (group.parent) {
			group = await groupRepo.findOne({
				where: { id: group.parent.id },
				relations: ["parent"]
			})
		} else {
			group = null
		}
	}

	return joinedGroups
}

export async function userCanJoinGroup(user: User, group: Group): Promise<boolean> {
	let pass = false
	const location = await decodeLocation(user.location)

	// check country
	if (location.country) {
		pass = group.rule.country.some(c => c === location.country || c === "any")
	}

	if (!pass) return pass

	// check state
	if (location.state) {
		pass = group.rule.state.some(s => s === location.state || s === "any")
	}

	if (!pass) return pass

	// check city
	if (location.city) {
		pass = group.rule.city.some(c => c === location.city || c === "any")
	}

	return pass
}
