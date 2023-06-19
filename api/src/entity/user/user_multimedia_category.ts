import { CreateDateColumn, Column } from "typeorm";

export class UserMultimediaCategory {
	constructor(name: string) {
		this.name = name
	}
	
	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column()
	name: string;
}