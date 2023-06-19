import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { UserMultimediaCategory } from "./user_multimedia_category";
import { UserAudio } from "./user_audio.entity";

@Entity()
export class UserAudioCategory extends UserMultimediaCategory {
	constructor(name: string) {
		super(name)
	}

	@PrimaryGeneratedColumn({
		name: "user_audio_category_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => User, user => user.audioCategories)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToMany(() => UserAudio, userAudio => userAudio.category)
	audios: UserAudio[];
}