import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";

export enum Reaction {
	Like = "Like",
	Dislike = "Dislike",
}

@Entity()
export class PostReaction {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({
		type: "enum",
		enum: Reaction,
		nullable: true,
	})
	reaction: Reaction;

	@ManyToOne(() => Post, post => post.comments)
	post: Post;

	@OneToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;
}