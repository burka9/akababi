import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";

@Entity()
export class GroupRule {
	@PrimaryGeneratedColumn({
		name: "group_rule_id"
	})
	id: number;

	@Column("simple-array")
	nationality: string[];

	@Column("simple-array")
	country: string[];

	@Column("simple-array")
	state: string[];

	@Column("simple-array")
	city: string[];
}