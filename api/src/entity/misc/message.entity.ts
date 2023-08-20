import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Notification } from "./notification.entity";
import { LocationOptions, LocationType } from "..";

@Entity()
export class Message {
	@PrimaryGeneratedColumn({
		name: "message_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		name: "text_message"
	})
	textMessage: string;

	@Column({
		type: "simple-json",
		name: "picture_message",
		nullable: true
	})
	pictureMessage: string[];

	@Column({
		type: "simple-json",
		name: "audio_message",
		nullable: true
	})
	audioMessage: string[];

	@Column({
		type: "simple-json",
		name: "video_message",
		nullable: true
	})
	videoMessage: string[];

	@Column({
		default: false
	})
	is_read: boolean;

	@Column(LocationOptions)
	location: LocationType;


	/**
	 * Hooks
	 */
	@BeforeInsert()
	@BeforeUpdate()
	validateColumns() {
		if (
			!this.textMessage &&
			!this.pictureMessage &&
			!this.audioMessage &&
			!this.videoMessage
		) throw new Error("Empty Message")
	}


	/**
	 * Relations
	 */
	@ManyToOne(() => User, user => user.sentMessages)
	@JoinColumn({
		name: "from_user_id"
	})
	from: User;

	@ManyToOne(() => User, user => user.receivedMessages)
	@JoinColumn({
		name: "to_user_id"
	})
	to: User;

	@OneToOne(() => Message, message => message.forwardFrom)
	@JoinColumn({
		name: "forward_from_message_id"
	})
	forwardFrom: Message;

	@OneToOne(() => Message, message => message.replyTo)
	@JoinColumn({
		name: "reply_to_message_id"
	})
	replyTo: Message;

	@OneToMany(() => Notification, notification => notification.message)
	notifications: Notification[];
}