import { CreateDateColumn, Column, Unique } from "typeorm";
import { Privacy } from "../..";

@Unique(["id", "name"])
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