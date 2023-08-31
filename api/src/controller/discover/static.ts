import { LocationType, Privacy } from "../../entity"
import { Post } from "../../entity/post/post.entity"
import { User } from "../../entity/user/user.entity"
import { postRepo } from "../post"
import { userRepo } from "../user"

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
			.leftJoin("post.reactions", "reaction")
			.leftJoin("reaction.user", "user_reaction")
			.leftJoin("post.comments", "comment")
			.leftJoin("reaction.user", "user_comment")
			.addSelect(["user.sub", "reaction", "user_reaction", "user_reaction.sub", "comment", "user_comment", "user_comment.sub"])
			.where("ST_Distance_Sphere(post.location, ST_GeomFromText(:point, 4326)) <= :radius", {
				point: `POINT(${longitude} ${latitude})`,
				radius
			})
			.orderBy("post.createdAt", "DESC")
			.getMany()
	}
}