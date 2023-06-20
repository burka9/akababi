import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity";
import { UserPicture } from "./user_picture.entity";
import { Privacy } from "..";
import { User } from "./user.entity";

@Entity()
export class ProfilePicture {
	@PrimaryGeneratedColumn({
		name: "profile_picture_id"
	})
	id: number;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone
	})
	privacy: Privacy;


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

	@OneToOne(() => User)
	user: User;
}
