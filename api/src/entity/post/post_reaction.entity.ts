import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { ReactionTag } from "./reaction_tag.entity";

@Entity()
export class PostReaction {
	@PrimaryGeneratedColumn({
		name: "post_reaction_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;


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