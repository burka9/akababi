import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PrivacySettingList {
	Everyone = "Everyone",
	Followers = "Followers",
	OnlyMe = "Only Me",
}

@Entity()
export class PrivacySetting {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: "enum",
		enum: PrivacySettingList,
		default: PrivacySettingList.Everyone
	})
	viewProfile: boolean;

	@Column({
		type: "enum",
		enum: PrivacySettingList,
		default: PrivacySettingList.Everyone
	})
	sendMessage: boolean;

	@Column({
		type: "enum",
		enum: PrivacySettingList,
		default: PrivacySettingList.Everyone
	})
	viewPosts: boolean;
}
