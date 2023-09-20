import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GroupCityInclusion {
	constructor(rule: number, city: number, include: boolean) {
		this.groupRule = rule
		this.city = city
		this.include = include
	}
	
	@PrimaryColumn({
		name: "group_rule_id"
	})
	groupRule: number;

	@PrimaryColumn({
		name: "city_id"
	})
	city: number;

	@Column()
	include: boolean;
}