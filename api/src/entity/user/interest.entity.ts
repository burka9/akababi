import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Interest {
	@PrimaryGeneratedColumn({
		name: "interest_id"
	})
	id: number;

	@Column({ unique: true })
	name: string;
}