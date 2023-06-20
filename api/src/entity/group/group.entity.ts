import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

	@Column(LocationOptions)
	location: LocationType;

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
		name: "members_privacy"
	})
	membersPrivacy: Privacy;


	/**
	 * Relations
	 */
	@OneToOne(() => Group)
	@JoinColumn({
		name: "parent_group_id"
	})
	parent: Group;

	@OneToOne(() => GroupRule, {
		cascade: true
	})
	rule: GroupRule;

	@OneToOne(() => User)
	@JoinColumn({
		name: "owner_user_id"
	})
	owner: User;

	@OneToMany(() => Post, post => post.group)
	posts: Post[];
}