import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity()
export class City {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn({
		name: "city_id"
	})
	id: number;

	@Column({
		name: "original_name"
	})
	name: string;

	@Column({
		name: "translated_name",
		nullable: true,
	})
	translatedName: string;

	@ManyToOne(() => Country, country => country.cities, {
		onDelete: "CASCADE"
	})
	@JoinColumn({
		name: "country_id"
	})
	country: Country;
}