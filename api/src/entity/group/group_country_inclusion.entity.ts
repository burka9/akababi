import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GroupCountryInclusion {
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