import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserFollower {
	@PrimaryColumn({
		name: "follower_id"
	})
	follower: string;

	@PrimaryColumn({
		name: "following_id"
	})
	following: string;
}