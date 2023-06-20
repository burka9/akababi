import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationType } from "..";
import { User } from "../user/user.entity";
import { Post } from "../post/post.entity";
import { PostComment } from "../post/post_comment.entity";
import { Message } from "./message.entity";

@Entity()
export class Notification {
	@PrimaryGeneratedColumn({
		name: "notification_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		default: false
	})
	is_read: boolean;

	@Column({
		type: "enum",
		enum: NotificationType,
		nullable: true
	})
	type: NotificationType;


	/**
	 * Relations
	 */
	@OneToOne(() => User)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToOne(() => Post)
	@JoinColumn({
		name: "post_id"
	})
	post: Post;

	@OneToOne(() => PostComment)
	@JoinColumn({
		name: "post_comment_id"
	})
	postComment: PostComment;

	@OneToOne(() => Message)
	@JoinColumn({
		name: "message_id"
	})
	message: Message;
}