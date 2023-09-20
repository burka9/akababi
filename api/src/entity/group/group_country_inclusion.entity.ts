import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GroupCountryInclusion {
	constructor(rule: number, country: number, include: boolean) {
		this.groupRule = rule
		this.country = country
		this.include = include
	}

	@PrimaryColumn({
		name: "group_rule_id"
	})
	groupRule: number;

	@PrimaryColumn({
		name: "country_id"
	})
	country: number;

	@Column()
	include: boolean;
}