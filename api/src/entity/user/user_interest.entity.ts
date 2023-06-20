import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserInterest {
	@PrimaryColumn({
		name: "user_profile_id"
	})
	profile: string;

	@PrimaryColumn({
		name: "interest_id"
	})
	interest: number;
}