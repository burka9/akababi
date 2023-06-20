import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GroupMembers {
	@PrimaryColumn({
		name: "user_id"
	})
	user: string;

	@PrimaryColumn({
		name: "group_id"
	})
	group: number;

	@CreateDateColumn({
		name: "joined_at"
	})
	joinedAt: Date;

	@Column({
		name: "is_admin",
		default: false
	})
	isAdmin: boolean;
}