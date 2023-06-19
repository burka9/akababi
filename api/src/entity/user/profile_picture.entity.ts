import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity";
import { UserPicture } from "./user_picture.entity";

@Entity()
export class ProfilePicture {
	@PrimaryGeneratedColumn({
		name: "profile_picture_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@OneToOne(() => UserProfile)
	profile: UserProfile;

	@OneToOne(() => UserPicture, {
		onUpdate: "CASCADE",
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "user_picture_id"
	})
	picture: UserPicture;
}
