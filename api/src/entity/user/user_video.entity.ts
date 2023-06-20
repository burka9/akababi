import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserMultimedia } from "./helper/user_multimedia";
import { UserVideoCategory } from "./user_video_category.entity";

@Entity()
export class UserVideo extends UserMultimedia {
	@PrimaryGeneratedColumn({
		name: "user_video_id"
	})
	id: number;

	/**
	 * Relations
	 */
	@ManyToOne(() => UserVideoCategory, userVideoCategory => userVideoCategory.videos)
	@JoinColumn({
		name: "user_video_category_id"
	})
	category: UserVideoCategory;
}