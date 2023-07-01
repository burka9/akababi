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
	user.audioCategories = [new UserAudioCategory(DEFAULT_CATEGORIES.audio)]
	user.pictureCategories = [new UserPictureCategory(DEFAULT_CATEGORIES.pictures)]
	user.videoCategories = [new UserVideoCategory(DEFAULT_CATEGORIES.videos)]

	return userRepo.save(user)
}
