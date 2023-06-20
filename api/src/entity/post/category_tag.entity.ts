import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class CategoryTag {
	@PrimaryGeneratedColumn({
		name: "category_tag_id"
	})
	id: number;

	@Column()
	name: string;


	/**
	 * Relations
	 */
	@OneToMany(() => Post, post => post.category)
	posts: Post[];
}