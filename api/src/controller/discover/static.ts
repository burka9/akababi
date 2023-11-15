import axios from "axios"
import { LocationType, Privacy } from "../../entity"
import { Group } from "../../entity/group/group.entity"
import { Post } from "../../entity/post/post.entity"
import { User } from "../../entity/user/user.entity"
import { groupRepo } from "../group"
import { postRepo } from "../post"
import { userRepo } from "../user"
import { GOOGLE } from "../../lib/env"
import { cityRepo, stateRepo } from "../../lib/load_data"

const types = ["country", "political"]

// decode country, state and city from location with google map api
export async function decodeLocation({ latitude, longitude }: LocationType): Promise<{ country?: string; state?: string; city?: string }> {
	const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE.MAPS_API_KEY}`)

	let list: any[] = data.results[0].address_components.filter((item: any) => item.types.filter((type: string) => types.includes(type)).length > 0)

	const country = list.splice(list.findIndex(item => item.types.includes("country")), 1)[0].long_name

	let state: any, city: any
	// figure out the state from database
	for await (const item of list) {
		state = await stateRepo.findOneBy({
			name: item.long_name,
			country
		})

		if (state) break
	}

	// figure out the city from database
	for await (const item of list) {
		city = city = await cityRepo.findOneBy({
			name: item.long_name,
			country,
			state: state ? state.name : undefined
		})

		if (city) break
	}

	const decoded: { [key: string]: any } = { country }

	if (state) decoded.state = state.name
	if (city) decoded.city = city.name

	return decoded
}

export default {
	discoverUser: async ({ longitude, latitude }: LocationType, radius: number): Promise<(User | any)[]> => {
		const users = await userRepo
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.profile", "user_profile")
			.leftJoinAndSelect("user_profile.profilePicture", "profile_picture")
			.leftJoinAndSelect("profile_picture.picture", "user_picture")
			.where("ST_Distance_Sphere(user.location, ST_GeomFromText(:point, 4326)) <= :radius", {
				point: `POINT(${longitude} ${latitude})`,
				radius
			})
			.getMany()

		return users.map((user: User | any) => {
			if (user.profile.profilePicture.privacy === Privacy.Everyone)
				user.profilePicture = user.profile.profilePicture.picture ? user.profile.profilePicture.picture.path : null

			user.gender = user.profile.gender
			user.firstName = user.profile.firstName
			user.lastName = user.profile.lastName
			delete user.profile

			return user
		})
	},
	discoverPost: async ({ longitude, latitude }: LocationType, radius: number): Promise<Post[]> => {
		return await postRepo
			.createQueryBuilder("post")
			.leftJoinAndSelect("post.category", "category")
			.leftJoin("post.user", "user")
			.leftJoinAndSelect("post.reactions", "reaction")
			.leftJoin("reaction.user", "user_reaction")
			.leftJoinAndSelect("post.comments", "comment")
			.leftJoin("reaction.user", "user_comment")
			.addSelect(["user.sub", "user", "user_reaction", "user_reaction.sub", "user_comment", "user_comment.sub", "shared_post.*"])
			.leftJoinAndSelect("post.shares", "shared_post", "shared_post.post_id = post.id")
			.where("ST_Distance_Sphere(post.location, ST_GeomFromText(:point, 4326)) <= :radius", {
				point: `POINT(${longitude} ${latitude})`,
				radius
			})
			.andWhere("post.group_id IS NULL")
			.orderBy("post.createdAt", "DESC")
			.addOrderBy("post.relevance", "DESC")
			.addOrderBy("post.views", "DESC")
			.getMany()
	},
	discoverGroup: async (location: { country?: string, state?: string, city?: string }): Promise<Group[]> => {
		return await groupRepo
			.createQueryBuilder("group")
			.leftJoinAndSelect("group.owner", "owner")
			.leftJoinAndSelect("group.rule", "rule")
			.getMany()
	}
}