import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { PostComment } from "./post.comment.entity";
import { PostReaction } from "./post.reaction.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ nullable: true })
	title: string;

	@Column("text", { nullable: true })
	textContent: string;

	@Column("json", { nullable: true })
	imageContentPath: string[];

	@Column("json", { nullable: true })
	audioContentPath: string[];

	@Column("json", { nullable: true })
	videoContentPath: string[];

	@Column({
		type: "geometry",
		spatialFeatureType: "Point",
		srid: 4326,
		select: false,
		nullable: true,
	})
	location: string;

	@Column({ default: 0 })
	relevance: number;

	@Column({
		type: "integer",
		unsigned: true,
		default: 0,
	})
	views: number;

	@Column({ nullable: true })
	category: string;

	@ManyToOne(() => User, user => user.posts)
	user: User;

	@OneToMany(() => PostComment, postComment => postComment.post)
	comments: PostComment[];

	@OneToMany(() => PostReaction, postReaction => postReaction.post)
	reactions: PostReaction[];
}