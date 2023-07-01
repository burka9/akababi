import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { UniqueNameOptions } from "..";

@Entity()
export class CategoryTag {
	constructor(name: string) {
		this.name = name
	}
	
	@PrimaryGeneratedColumn({
		name: "category_tag_id"
	})
	id: number;

	@Column(UniqueNameOptions)
	name: string;


	/**
	 * Relations
	 */
	@OneToMany(() => Post, post => post.category)
	posts: Post[];
}