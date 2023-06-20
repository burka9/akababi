import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GroupCityInclusion {
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