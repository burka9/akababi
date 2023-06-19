import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity";
import { UserAudioCategory } from "./user_audio_category.entity";
import { UserPictureCategory } from "./user_picture_category.entity";
import { UserVideoCategory } from "./user_video_category.entity";

@Entity()
export class User {
	@PrimaryColumn({
		name: "user_id"
	})
	sub: string;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		unique: true
	})
	email: string;

	@Column({
		unique: true,
		nullable: true
	})
	phone: string;

	@Column({
		type: "geometry",
		spatialFeatureType: "Point",
		srid: 4326,
		nullable: true,
		transformer: {
			from(value: string) {
				const [longitude, latitude] = value.substring(6, value.length-1).split(" ")
				return { longitude, latitude }
			},
			to({ longitude, latitude }: { longitude: number, latitude: number}) {
				return `POINT(${longitude} ${latitude})`
			},
		},
	})
	location: { longitude: number, latitude: number};


	/**
	 * Relations
	 */
	@OneToOne(() => UserProfile, {
		cascade: true
	})
	@JoinColumn({
		name: "user_profile_id"
	})
	profile: UserProfile;

	@OneToMany(() => UserAudioCategory, userAudioCategory => userAudioCategory.user, {
		cascade: ["insert"]
	})
	audioCategories: UserAudioCategory[];

	@OneToMany(() => UserPictureCategory, userPictureCategory => userPictureCategory.user, {
		cascade: ["insert"]
	})
	pictureCategories: UserPictureCategory[];

	@OneToMany(() => UserVideoCategory, userVideoCategory => userVideoCategory.user, {
		cascade: ["insert"]
	})
	videoCategories: UserVideoCategory[];
}