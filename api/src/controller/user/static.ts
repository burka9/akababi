import { DEFAULT_CATEGORIES, userRepo } from "."
import { ProfilePicture } from "../../entity/user/profile_picture.entity"
import { User } from "../../entity/user/user.entity"
import { UserAudioCategory } from "../../entity/user/user_audio_category.entity"
import { UserPictureCategory } from "../../entity/user/user_picture_category.entity"
import { UserProfile } from "../../entity/user/user_profile.entity"
import { UserVideoCategory } from "../../entity/user/user_video_category.entity"

export const createNewUser = async (user: User): Promise<User> => {
	user.profile = new UserProfile()
	user.profile.profilePicture = new ProfilePicture()
	user.audioCategories = DEFAULT_CATEGORIES.audio.map(category => new UserAudioCategory(category))
	user.pictureCategories = DEFAULT_CATEGORIES.pictures.map(category => new UserPictureCategory(category))
	user.videoCategories = DEFAULT_CATEGORIES.videos.map(category => new UserVideoCategory(category))

	return userRepo.save(user)
}
