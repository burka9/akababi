import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationType } from "..";
import { User } from "../user/user.entity";
import { Post } from "../post/post.entity";
import { PostComment } from "../post/post_comment.entity";
import { Message } from "./message.entity";
import { PostReaction } from "../post/post_reaction.entity";

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
		default: false,
		name: "is_read"
	})
	isRead: boolean;

	@Column({
		type: "enum",
		enum: NotificationType,
		nullable: true
	})
	type: NotificationType;


	/**
	 * Relations
	 */
	@ManyToOne(() => User, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@ManyToOne(() => User, user => user.notifications, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "to_user_id"
	})
	owner: User;

	@ManyToOne(() => Post, post => post.notifications, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "post_id"
	})
	post: Post;

	@ManyToOne(() => PostComment, postComment => postComment.notifications, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "post_comment_id"
	})
	postComment: PostComment;

	@ManyToOne(() => PostReaction, postReactions => postReactions.notifications, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "post_reaction_id"
	})
	postReaction: PostReaction;

	@ManyToOne(() => Message, message => message.notifications, {
		onDelete: "SET NULL"
	})
	@JoinColumn({
		name: "message_id"
	})
	message: Message;
}