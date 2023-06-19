import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { UserMultimediaCategory } from "./user_multimedia_category";
import { UserPicture } from "./user_picture.entity";

@Entity()
export class UserPictureCategory extends UserMultimediaCategory {
	constructor(name: string) {
		super(name)
	}

	@PrimaryGeneratedColumn({
		name: "user_picture_category_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => User, user => user.pictureCategories)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToMany(() => UserPicture, userPicture => userPicture.category)
	pictures: UserPicture[];
}