import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationOptions, LocationType, Privacy } from "..";
import { GroupRule } from "./group_rule.entity";
import { User } from "../user/user.entity";
import { Post } from "../post/post.entity";

@Entity()
export class Group {
	@PrimaryGeneratedColumn({
		name: "group_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column()
	name: string;

	@Column("text")
	description: string;

	// @Column(LocationOptions)
	// location: LocationType;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
		name: "post_privacy"
	})
	postPrivacy: Privacy;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
		name: "member_privacy"
	})
	memberPrivacy: Privacy;

	@Column({
		nullable: true
	})
	picture: string;


	/**
	 * Relations
	 */
	@ManyToOne(() => Group, group => group.children)
	@JoinColumn({
		name: "parent_group_id"
	})
	parent: Group;

	@OneToMany(() => Group, group => group.parent)
	children: Group[];

	@OneToOne(() => GroupRule, {
		cascade: true
	})
	@JoinColumn({
		name: "group_rule_id"
	})
	rule: GroupRule;

	@ManyToOne(() => User, user => user.groups)
	@JoinColumn({
		name: "owner_user_id"
	})
	owner: User;

	@OneToMany(() => Post, post => post.group)
	posts: Post[];
}