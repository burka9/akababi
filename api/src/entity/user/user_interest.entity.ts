import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserInterest {
	constructor(profile: number, interest: number) {
		this.profile = profile
		this.interest = interest
	}
	
	@PrimaryColumn({
		name: "user_profile_id"
	})
	profile: number;

	@PrimaryColumn({
		name: "interest_id"
	})
	interest: number;
}