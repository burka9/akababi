import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Country {
	@PrimaryGeneratedColumn({
		name: "country_id"
	})
	id: number;

	@Column({
		name: "original_name"
	})
	originalName: string;

	@Column({
		name: "translated_name",
		nullable: true,
	})
	translatedName: string;

	@Column()
	code: string;
}