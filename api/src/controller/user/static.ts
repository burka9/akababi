import { DEFAULT_CATEGORIES, userFollowerRepo, userRepo } from "."
import { ProfilePicture } from "../../entity/user/profile_picture.entity"
import { User } from "../../entity/user/user.entity"
import { UserAudioCategory } from "../../entity/user/user_audio_category.entity"
import { UserPictureCategory } from "../../entity/user/user_picture_category.entity"
import { UserProfile } from "../../entity/user/user_profile.entity"
import { UserVideoCategory } from "../../entity/user/user_video_category.entity"
import { postRepo } from "../post"
import { userInterestRepo } from "./profile"

export const createNewUser = async (user: User): Promise<User> => {
	user.profile = new UserProfile()
	user.profile.profilePicture = new ProfilePicture()
	user.audioCategories = [new UserAudioCategory(DEFAULT_CATEGORIES.audio)]
	user.pictureCategories = [new UserPictureCategory(DEFAULT_CATEGORIES.pictures)]
	user.videoCategories = [new UserVideoCategory(DEFAULT_CATEGORIES.videos)]

	return userRepo.save(user)
}

export const readUserProfile = async (user: User): Promise<any> => {
	const interests = await userInterestRepo
			.query(`
				SELECT interest.*
				FROM user_interest
				LEFT JOIN interest ON user_interest.interest_id = interest.interest_id
				WHERE user_interest.user_profile_id = ${user.profile.id}
			`)

		const [posts, totalPosts] = await postRepo.findAndCount({
			where: {
				user: { sub: user.sub }
			},
			relations: ["reactions"]
		})

		const [followers, totalFollowers] = await userFollowerRepo.findAndCountBy({
			following: user.sub
		})

		const totalReactions = posts.reduce((acc, post) => acc + post.reactions.length, 0)

		return { ...user, interests, totalPosts, totalReactions, totalFollowers }
}