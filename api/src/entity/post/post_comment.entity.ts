import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LocationOptions, LocationType } from "..";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Notification } from "../misc/notification.entity";

@Entity()
export class PostComment {
	@PrimaryGeneratedColumn({
		name: "post_comment_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		name: "text_comment",
		nullable: true,
	})
	textComment: string;

	@Column({
		name: "image_comment",
		nullable: true,
	})
	imageComment: string;

	@Column({
		name: "audio_comment",
		nullable: true,
	})
	audioComment: string;

	@Column({
		name: "video_comment",
		nullable: true,
	})
	videoComment: string;

	@Column(LocationOptions)
	location: LocationType;


	/**
	 * Hooks
	 */
	@BeforeInsert()
	@BeforeUpdate()
	validateColumns() {
		if (
			!this.textComment &&
			!this.imageComment &&
			!this.audioComment &&
			!this.videoComment
		) throw new Error("Empty Comment")
	}


	/**
	 * Relations
	 */
	@ManyToOne(() => Post, post => post.comments)
	@JoinColumn({
		name: "post_id"
	})
	post: Post;

	@ManyToOne(() => User, user => user.comments)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToMany(() => Notification, notification => notification.postComment)
	notifications: Notification[];
}