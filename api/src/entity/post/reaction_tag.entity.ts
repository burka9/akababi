import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostReaction } from "./post_reaction.entity";

@Entity()
export class ReactionTag {
	@PrimaryGeneratedColumn({
		name: "reaction_tag_id"
	})
	id: number;

	@Column()
	name: string;


	/**
	 * Relations
	 */
	@OneToMany(() => PostReaction, postReaction => postReaction.reaction)
	reactions: PostReaction[];
}