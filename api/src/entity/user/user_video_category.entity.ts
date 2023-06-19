import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { UserMultimediaCategory } from "./user_multimedia_category";
import { UserVideo } from "./user_video.entity";

@Entity()
export class UserVideoCategory extends UserMultimediaCategory {
	constructor(name: string) {
		super(name)
	}

	@PrimaryGeneratedColumn({
		name: "user_video_category_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => User, user => user.videoCategories)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToMany(() => UserVideo, userVideo => userVideo.category)
	videos: UserVideo[];
}