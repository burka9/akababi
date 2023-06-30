import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserInterest {
	@PrimaryColumn({
		name: "user_profile_id"
	})
	profile: number;

	@PrimaryColumn({
		name: "interest_id"
	})
	interest: number;
}