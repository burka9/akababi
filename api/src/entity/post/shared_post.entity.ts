import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationOptions, LocationType, Privacy } from "..";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";

@Entity()
export class SharedPost {
	@PrimaryGeneratedColumn({
		name: "shared_post_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column(LocationOptions)
	location: LocationType;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone
	})
	privacy: Privacy;

	
	/**
	 * Relations
	 */
	@ManyToOne(() => Post, post => post.shares)
	@JoinColumn({
		name: "post_id"
	})
	post: Post;

	@OneToOne(() => User)
	@JoinColumn({
		name: "user_id"
	})
	user: User;
}