import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["name", "code", "country"])
export class State {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	code: string;

	@Column()
	country: string;
}