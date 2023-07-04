import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { ReactionTag } from "./reaction_tag.entity";
import { LocationOptions, LocationType } from "..";

@Entity()
export class PostReaction {
	constructor(reaction: ReactionTag, post: Post, user: User, location: LocationType) {
		this.reaction = reaction
		this.post = post
		this.user = user
		this.location = location
	}
	
	@PrimaryGeneratedColumn({
		name: "post_reaction_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column(LocationOptions)
	location: LocationType;


	/**
	 * Relations
	 */
	@OneToOne(() => ReactionTag)
	@JoinColumn({
		name: "reaction_tag_id"
	})
	reaction: ReactionTag;
	
	@ManyToOne(() => Post, post => post.reactions)
	@JoinColumn({
		name: "post_id"
	})
	post: Post;

	@ManyToOne(() => User, user => user.posts)
	@JoinColumn({
		name: "user_id"
	})
	user: User;
}