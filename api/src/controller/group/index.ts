import { Request, Response } from "express";
import { Database } from "../../database";
import { Group } from "../../entity/group/group.entity";
import { GroupMembers } from "../../entity/group/group_members.entity";
import { User } from "../../entity/user/user.entity";
import { BadFields } from "../../lib/errors";
import { matchedData, validationResult } from "express-validator";
import { Privacy } from "../../entity";
import { goodRequest } from "../../lib/response";
import { GroupRule } from "../../entity/group/group_rule.entity";
import { userRepo } from "../user";

export const groupRepo = Database.getRepository(Group)
export const groupRulrepo = Database.getRepository(GroupRule)
export const groupMemberRepo = Database.getRepository(GroupMembers)

class GroupController {
	async createGroup(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const user = res.locals.user as User
		const { name, description, post_privacy, member_privacy, parent_id, nationality, country, state, city } = matchedData(req)

		// create group object
		const group = new Group()
		group.owner = user
		group.name = name
		group.description = description ? description : ""

		if (post_privacy in Privacy) {
			group.postPrivacy = post_privacy
		} else {
			group.postPrivacy = Privacy.Everyone
		}

		if (member_privacy in Privacy) {
			group.memberPrivacy = member_privacy
		} else {
			group.memberPrivacy = Privacy.Everyone
		}
		
		// group picture
		if (req.file) {
			group.picture = req.file.filename
		}

		// group rule object
		const rule = new GroupRule()

		// parent group
		const parent = await groupRepo.findOne({
			where: { id: parent_id },
			relations: ["owner", "rule"]
		})

		if (parent && parent.owner.sub === user.sub) {
			rule.city = city ? JSON.parse(city) : parent.rule.city
			rule.state = state ? JSON.parse(state) : parent.rule.state
			rule.country = country ? JSON.parse(country) : parent.rule.country
			rule.nationality = nationality ? JSON.parse(nationality) : parent.rule.nationality
		} else {
			rule.city = city ? JSON.parse(city) : ["any"]
			rule.state = state ? JSON.parse(state) : ["any"]
			rule.country = country ? JSON.parse(country) : ["any"]
			rule.nationality = nationality ? JSON.parse(nationality) : ["any"]
		}

		await groupRulrepo.save(rule)
		
		group.rule = rule
		await groupRepo.save(group)

		// set admin & member
		const member = new GroupMembers()
		member.group = group.id
		member.user = user.sub
		member.isAdmin = true

		await groupMemberRepo.save(member)
		
		goodRequest(res)
	} // create group

	async addMembersAsAdmin(req: Request, res: Response) {
		const result = validationResult(req)
		if (!result.isEmpty()) throw new BadFields()

		const group = res.locals.group as Group

		// sub is array of user.sub
		const { sub } = matchedData(req)

		for await (const s of sub) {
			const user = await userRepo.findOneBy({ sub })

			if (user) {
				await groupMemberRepo.insert({
					group: group.id,
					user: user.sub,
				})
			}
		}
		
		goodRequest(res)
	} // add member as admin
	
	// async joinGroup(req: Request, res: Response) {
	// 	const result = validationResult(req)
	// 	if (!result.isEmpty()) throw new BadFields()

	// 	const user = res.locals.user as User
	// 	const { group_id } = matchedData(req)

	// 	const joinedGroups = addUserToGroup(user, group_id)

	// 	goodRequest(res, { joinedGroups })
	// }

	// async getMyGroups(req: Request, res: Response) {
	// 	const user = res.locals.user as User

	// 	const groups = await groupMemberRepo.find({
	// 		where: {
	// 			user: user.sub
	// 		},
	// 		relations: ["group"]
	// 	})

	// 	goodRequest(res, { groups })
	// }

	// async leaveGroup(req: Request, res: Response) {
	// 	const result = validationResult(req)
	// 	if (!result.isEmpty()) throw new BadFields()

	// 	const user = res.locals.user as User
	// 	const { group_id } = matchedData(req)

	// 	const member = await groupMemberRepo.findOneBy({
	// 		user: user.sub,
	// 		group: group_id
	// 	})
	// 	if (!member) throw new NoItem("User in group")

	// 	await groupMemberRepo.remove(member)

	// 	goodRequest(res)
	// }

	// async postToGroup(req: Request, res: Response) {
	// 	const user = res.locals.user as User
	// 	const group = res.locals.group as Group
	// 	const result = validationResult(req)
	// 	if (!result.isEmpty()) throw new BadFields(result)
		
	// 	const { text, category_id } = matchedData(req)

	// 	const post = new Post()
	// 	post.textContent = text
	// 	post.imageContents = []
	// 	post.audioContents = []
	// 	post.videoContents = []
	// 	post.user = user
	// 	post.location = res.locals.location
	// 	post.group = group

	// 	if (category_id) {
	// 		const category = await categoryRepo.findOneBy({ id: category_id })
	// 		if (category)
	// 			post.category = category
	// 	}

	// 	// files
	// 	if (req.files) {
	// 		const { image, audio, video }: {
	// 			image: Express.Multer.File[],
	// 			audio: Express.Multer.File[],
	// 			video: Express.Multer.File[],
	// 		} = req.files as any

	// 		if (image) image.forEach(file => post.imageContents.push(file.filename))
	// 		if (audio) audio.forEach(file => post.audioContents.push(file.filename))
	// 		if (video) video.forEach(file => post.videoContents.push(file.filename))
	// 	}

	// 	await postRepo.save(post)

	// 	goodRequest(res)
	// }
}

export default new GroupController()