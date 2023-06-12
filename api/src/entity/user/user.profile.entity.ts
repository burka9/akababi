import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserProfile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column("date", { nullable: true })
	birthday: Date;
	
	@Column({ nullable: true })
	maritalStatus: string;

	@Column("json", { nullable: true })
	interests: string[];

	@Column({ nullable: true })
	nationality: string;

	@Column({ nullable: true })
	profilePicturePath: string;

	@Column({ default: true })
	isNew: boolean;
	
	// @OneToOne(() => User)
	// @JoinColumn()
	// user: User;
}