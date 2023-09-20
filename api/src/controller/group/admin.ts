import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { User } from "../../entity/user/user.entity";
import { BadFields } from "../../lib/errors";
import { Group } from "../../entity/group/group.entity";
import { GroupRule } from "../../entity/group/group_rule.entity";
import { Database } from "../../database";
import { groupMemberRepo, groupRepo } from ".";
import { cityRepo } from "../misc/city";
import { countryRepo } from "../misc/country";
import { GroupCityInclusion } from "../../entity/group/group_city_inclusion.entity";
import { GroupCountryInclusion } from "../../entity/group/group_country_inclusion.entity";
import { goodRequest } from "../../lib/response";
import { GroupMembers } from "../../entity/group/group_members.entity";
import { userRepo } from "../user";
import { addUserToGroup } from "./static";

export const groupRuleRepo = Database.getRepository(GroupRule)
export const cityInclusionRepo = Database.getRepository(GroupCityInclusion)
export const countryInclusionRepo = Database.getRepository(GroupCountryInclusion)

class GroupAdminController {
	async createNewGroup(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const {
			// required
			name,

			// number
			min_eligible_age,
			max_eligible_age,

			// this should be an array of id (number, but will be parsed for checking)
			include_city,
			exclude_city,

			// this should be an array of id (number, but will be parsed for checking)
			include_country,
			exclude_country,

			/*
				Location & Nationality
					when adding people to groups, include will be prioritized over exclude
					meaning, a person's location and nationality will be checked if it's in the include list
					if the include list is empty, it will accept all but the exclude list location and nationality

					if both list exist, it will give priority to the inclusion list
			*/

			// this should be an array of nationalities (string)
			include_nationality,
			exclude_nationality,

			parent_group_id
		} = matchedData(req)

		// create group
		const group = new Group()
		group.name = name
		group.owner = user
		group.location = res.locals.location

		// find the parent group and attach it
		const parent = await groupRepo.findOneBy({ id: parent_group_id })
		if (parent)
			group.parent = parent

		await groupRepo.save(group)

		// add the creator as the first member
		const member = new GroupMembers()
		member.group = group.id
		member.isAdmin = true
		member.user = user.sub

		await groupMemberRepo.save(member)

		// create group rule entity
		const rule = new GroupRule()
		rule.group = group
		rule.eligibleNationality = include_nationality ? include_nationality : []
		rule.excludeNationality = exclude_nationality ? exclude_nationality : []

		if (!isNaN(Number(max_eligible_age)))
			rule.maxAge = Number(max_eligible_age)
		if (!isNaN(Number(min_eligible_age)))
			rule.minAge = Number(min_eligible_age)

		await groupRuleRepo.save(rule)


		for await (const id of include_city) {
			try {
				const city = await cityRepo.findOneBy({ id })
				if (city) {
					await cityInclusionRepo.save(new GroupCityInclusion(rule.id, id, true))
				}
			} catch { }
		}
		for await (const id of exclude_city) {
			try {
				const city = await cityRepo.findOneBy({ id })
				if (city) {
					await cityInclusionRepo.save(new GroupCityInclusion(rule.id, id, false))
				}
			} catch { }
		}

		for await (const id of include_country) {
			try {
				const country = await countryRepo.findOneBy({ id })
				if (country) {
					await countryInclusionRepo.save(new GroupCountryInclusion(rule.id, id, true))
				}
			} catch { }
		}
		for await (const id of exclude_country) {
			try {
				const country = await countryRepo.findOneBy({ id })
				if (country) {
					await countryInclusionRepo.save(new GroupCountryInclusion(rule.id, id, true))
				}
			} catch { }
		}

		goodRequest(res, { group })
	} // create new group

	async addUserToGroup(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const group = res.locals.group as Group
		const { user_sub } = matchedData(req)

		const newMember = await userRepo.findOneByOrFail({ sub: user_sub })
		
		await addUserToGroup(user, group.id)
	}
}

export default new GroupAdminController()