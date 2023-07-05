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

interface FollowerList {
	timestamp: Date;
	sub: string;
	first_name: string;
	last_name: string;
	profile_picture: string;
}

export const getFollowers = async (user: User): Promise<FollowerList[]> => {
	// check profile picture privacy
	const followers: FollowerList[] = await userFollowerRepo
		.query(`
			SELECT
				user_follower.created_at AS timestamp,
				user.user_id AS sub,
				profile.first_name,
				profile.last_name,
				user_picture.path AS profile_picture
			FROM user_follower

			LEFT JOIN user
			ON following_id = "${user.sub}"
			
			LEFT JOIN user_profile profile
			ON following_id = "${user.sub}"

			LEFT JOIN profile_picture profile_p
			ON profile_p.profile_picture_id = profile.profile_picture_id

			LEFT JOIN user_picture
			ON user_picture.user_picture_id = profile_p.user_picture_id

			WHERE following_id = "${user.sub}"
		`)

	return followers.map(user => {
		user.timestamp = new Date(user.timestamp)
		return user
	})
}
