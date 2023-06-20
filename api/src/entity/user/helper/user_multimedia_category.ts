import { CreateDateColumn, Column } from "typeorm";
import { Privacy } from "../..";

export abstract class UserMultimediaCategory {
	constructor(name: string) {
		this.name = name
	}
	
	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column()
	name: string;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone
	})
	privacy: Privacy;
}