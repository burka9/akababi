import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserMultimedia } from "./user_multimedia";
import { UserPictureCategory } from "./user_picture_category.entity";
import { ProfilePicture } from "./profile_picture.entity";

@Entity()
export class UserPicture extends UserMultimedia {
	@PrimaryGeneratedColumn({
		name: "user_picture_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => UserPictureCategory, userPictureCategory => userPictureCategory.pictures)
	@JoinColumn({
		name: "user_picture_category_id"
	})
	category: UserPictureCategory;

	@OneToOne(() => ProfilePicture)
	profilePicture: ProfilePicture;
}