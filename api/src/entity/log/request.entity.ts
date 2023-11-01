import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class IncomingRequest {
	@PrimaryGeneratedColumn({
		name: "incoming_request_id"
	})
	id: number;

	@Column({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		name: "response_at",
		nullable: true
	})
	responseAt: Date;

	@Column()
	url: string;
	
	@Column()
	ip: string;

	@Column()
	method: string;
	
	@Column()
	params: string;

	@Column()
	query: string;

	@Column("text")
	headers: string;

	@Column("text")
	body: string;

	@Column({
		name: "status_code",
		nullable: true
	})
	statusCode: number;

	@Column({
		name: "status_message",
		nullable: true
	})
	statusMessage: string;
}