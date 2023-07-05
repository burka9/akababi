import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserFollower {
	@PrimaryColumn({
		name: "follower_id"
	})
	follower: string; // the follower

	@PrimaryColumn({
		name: "following_id"
	})
	following: string; // the followee

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;
}