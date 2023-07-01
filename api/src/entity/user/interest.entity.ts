import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UniqueNameOptions } from "..";

@Entity()
export class Interest {
	constructor(name: string) {
		this.name = name
	}

	@PrimaryGeneratedColumn({
		name: "interest_id"
	})
	id: number;

	@Column(UniqueNameOptions)
	name: string;
}