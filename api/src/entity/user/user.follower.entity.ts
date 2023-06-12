import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserFollower {
	@PrimaryColumn()
	follower: string;

	@PrimaryColumn()
	following: string;
}
