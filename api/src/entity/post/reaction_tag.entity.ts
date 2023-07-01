import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostReaction } from "./post_reaction.entity";
import { UniqueNameOptions } from "..";

@Entity()
export class ReactionTag {
	constructor(name: string) {
		this.name = name
	}
	
	@PrimaryGeneratedColumn({
		name: "reaction_tag_id"
	})
	id: number;

	@Column(UniqueNameOptions)
	name: string;


	/**
	 * Relations
	 */
	@OneToMany(() => PostReaction, postReaction => postReaction.reaction)
	reactions: PostReaction[];
}