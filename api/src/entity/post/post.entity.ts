import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationOptions, LocationType, Privacy } from "..";
import { PostComment } from "./post_comment.entity";
import { PostReaction } from "./post_reaction.entity";
import { User } from "../user/user.entity";
import { SharedPost } from "./shared_post.entity";
import { CategoryTag } from "./category_tag.entity";
import { Group } from "../group/group.entity";
import { Notification } from "../misc/notification.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn({
		name: "post_id"
	})
	id: number;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column("text", {
		name: "text_content",
		nullable: true
	})
	textContent: string;

	@Column({
		type: "simple-array",
		name: "image_contents",
		nullable: true,
	})
	imageContents: string[];

	@Column({
		type: "simple-array",
		name: "audio_contents",
		nullable: true,
	})
	audioContents: string[];

	@Column({
		type: "simple-array",
		name: "video_contents",
		nullable: true,
	})
	videoContents: string[];

	@Column(LocationOptions)
	location: LocationType;

	@Column({
		default: 0
	})
	relevance: number;

	@Column({
		type: "bigint",
		default: 0,
		unsigned: true,
	})
	views: number;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
		name: "post_privacy"
	})
	postPrivacy: Privacy;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
		name: "comment_privacy"
	})
	commentPrivacy: Privacy;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
		name: "reaction_privacy"
	})
	reactionPrivacy: Privacy;


	/**
	 * Hooks
	 */
	@BeforeInsert()
	@BeforeUpdate()
	validateColumns() {
		if (
			!this.textContent &&
			!this.imageContents &&
			!this.audioContents &&
			!this.videoContents
		) throw new Error("Empty Post")
	}


	/**
	 * Relations
	*/
	@ManyToOne(() => User, user => user.posts)
	@JoinColumn({
		name: "user_id"
	})
	user: User;

	@OneToMany(() => PostComment, postComment => postComment.post)
	comments: PostComment[];

	@OneToMany(() => PostReaction, postReaction => postReaction.post)
	reactions: PostReaction[];

	@OneToMany(() => SharedPost, sharedPost => sharedPost.post)
	shares: SharedPost[];

	@ManyToOne(() => CategoryTag, categoryTag => categoryTag.posts)
	@JoinColumn({
		name: "category_tag_id",
	})
	category: CategoryTag;

	@ManyToOne(() => Group, group => group.posts)
	@JoinColumn({
		name: "group_id"
	})
	group: Group;

	@OneToMany(() => Notification, notification => notification.post)
	notifications: Notification[];
}