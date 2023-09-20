import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";

@Entity()
export class Country {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn({
		name: "country_id"
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

	@Column({
		nullable: true
	})
	code: string;

	@OneToMany(() => City, city => city.country)
	cities: City[];
}