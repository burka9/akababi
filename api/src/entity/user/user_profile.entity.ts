import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ProfilePicture } from "./profile_picture.entity";

export enum MaritalStatus {
	Single = "Single",
	InARelationship = "InARelationship",
	Married = "Married",
	Divorced = "Divorced",
	Widow = "Wirdow",
}

@Entity()
export class UserProfile {
	@PrimaryGeneratedColumn({
		name: "user_profile_id"
	})
	id: number;

	@Column({
		name: "first_name",
		nullable: true
	})
	firstName: string;

	@Column({
		name: "last_name",
		nullable: true
	})
	lastName: string;

	@Column({
		nullable: true
	})
	birthday: Date;

	@Column({
		type: "enum",
		enum: MaritalStatus,
		nullable: true,
		name: "marital_status"
	})
	maritalStatus: MaritalStatus;

	@Column({
		nullable: true
	})
	nationality: string;

	@Column({
		default: true,
		name: "is_a_new_user"
	})
	newUser: boolean;


	/**
	 * Relations
	 */
	@OneToOne(() => User)
	user: User;

	@OneToOne(() => ProfilePicture, {
		cascade: true
	})
	@JoinColumn({
		name: "profile_picture_id"
	})
	profilePicture: ProfilePicture;
}