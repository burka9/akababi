import { CreateDateColumn, Column } from "typeorm";

export class UserMultimedia {
	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column()
	path: string;
}