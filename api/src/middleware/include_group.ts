import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user/user.entity";
import logger from "../lib/logger";
import { Group } from "../entity/group/group.entity";
import { NoItem, error } from "../lib/errors";
import { groupRepo } from "../controller/group";

const fetchGroup = async (groupId: number): Promise<Group> => {
	const group = await groupRepo
		.createQueryBuilder("group")
		.leftJoinAndSelect("group.owner", "owner")
		// .addSelect("owner.sub")
		// .leftJoinAndSelect("group_city_inclusion", "city_inclusion")
		// .leftJoinAndSelect("city_inclusion.city", "city", "city.id = city_inclusion.city")
		// .leftJoinAndSelect("city.country", "country")
		// .leftJoinAndSelect("group_country_inclusion", "country_inclusion")
		// .leftJoinAndSelect("country_inclusion.country", "country")
		.where("group.id = :groupId", { groupId })
		.getOne()

	if (!group) throw new NoItem("Group")

	return group
}

export const IncludeGroup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const groupId = Number(req.query.group_id) || Number(req.params.group_id) || Number(req.body.group_id)
		const group = await fetchGroup(groupId)
		
		if (!group) throw new NoItem("Group")
		
		res.locals.group = group

		next()
	} catch (err: any) {
		logger.error(err.message)
		throw err
	}
}

export const IncludeGroupAndValidateOwner = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = res.locals.user as User
		const groupId = Number(req.query.group_id) || Number(req.params.group_id) || Number(req.body.group_id)
		const group = await fetchGroup(groupId)

		const isAdmin = (group.owner.sub === user.sub)
		
		if (!isAdmin) throw new error("Group does not belong to user")
		
		res.locals.group = group

		next()
	} catch (err: any) {
		logger.error(err.message)
		throw err
	}
}