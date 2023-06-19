import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserMultimedia } from "./user_multimedia";
import { UserAudioCategory } from "./user_audio_category.entity";

@Entity()
export class UserAudio extends UserMultimedia {
	@PrimaryGeneratedColumn({
		name: "user_audio_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => UserAudioCategory, userAudioCategory => userAudioCategory.audios)
	@JoinColumn({
		name: "user_audio_category_id"
	})
	category: UserAudioCategory;
}