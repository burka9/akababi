import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReactionTag {
	constructor(name: string) {
		this.name = name
	}
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;
}