import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LocationType } from "..";

@Entity()
export class Country {
	@PrimaryGeneratedColumn({
		name: "country_id"
	})
	id: number;

	@Column({
		unique: true
	})
	name: string;

	@Column({
		nullable: true
	})
	nationality: string;

	@Column({
		nullable: true
	})
	iso2: string;

	@Column({
		nullable: true
	})
	iso3: string;

	@Column({
		nullable: true
	})
	continent: string;
}