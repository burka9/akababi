import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";

@Entity()
export class PostComment {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column("text")
	textComment: string;

	@Column({ nullable: true })
	imageCommentPath: string;

	@Column({ nullable: true })
	audioCommentPath: string;

	@Column({ nullable: true })
	videCommentPath: string;

	@ManyToOne(() => User, user => user.comments)
	user: User;

	@ManyToOne(() => Post, post => post.comments)
	post: Post;
}