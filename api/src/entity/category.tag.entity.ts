import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoryTag {
	constructor(name: string) {
		this.name = name
	}
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;
}
