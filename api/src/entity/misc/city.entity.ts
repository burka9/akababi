import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { LocationType } from "..";

@Entity()
@Unique(["name", "country"])
export class City {
	@PrimaryGeneratedColumn({
		name: "city_id"
	})
	id: number;

	@Column()
	name: string;

	@Column()
	country: string;

	@Column()
	state: string;
}
