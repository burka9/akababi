import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";

@Entity()
export class GroupRule {
	@PrimaryGeneratedColumn({
		name: "group_rule_id"
	})
	id: number;

	@Column({
		type: "smallint",
		name: "min_age",
		unsigned: true
	})
	minAge: number;

	@Column({
		type: "smallint",
		name: "max_age",
		unsigned: true
	})
	maxAge: number;	

	@Column({
		type: "simple-array",
		name: "eligible_nationality"
	})
	eligibleNationality: string[];

	@Column({
		type: "simple-array",
		name: "exclude_nationality"
	})
	excludeNationality: string[];


	/**
	 * Relations
	 */
	@OneToOne(() => Group)
	@JoinColumn({
		name: "group_id"
	})
	group: Group;
}