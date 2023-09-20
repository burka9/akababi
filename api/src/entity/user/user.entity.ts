import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity";
import { UserAudioCategory } from "./user_audio_category.entity";
import { UserPictureCategory } from "./user_picture_category.entity";
import { UserVideoCategory } from "./user_video_category.entity";
import { LocationOptions, LocationType, Privacy } from "..";
import { PostComment } from "../post/post_comment.entity";
import { Post } from "../post/post.entity";
import { PostReaction } from "../post/post_reaction.entity";
import { SharedPost } from "../post/shared_post.entity";
import { Message } from "../misc/message.entity";
import { Group } from "../group/group.entity";
import { Notification } from "../misc/notification.entity";
import { SavedMedia } from "../post/saved_media.entity";
import { Database } from "../../database";
import { UserFollower } from "./user_follower.entity";

@Entity()
export class User {
	@PrimaryColumn({
		name: "user_id"
	})
	sub: string;

	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		unique: true,
		nullable: true,
	})
	email: string;

	@Column({
		unique: true,
		nullable: true
	})
	phone: string;

	@Column(LocationOptions)
	location: LocationType;

	@Column({
		name: "online_status_privacy",
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone,
	})
	onlineStatusPrivacy: Privacy;

	@Column({
		name: "last_online",
		nullable: true,
	})
	lastOnline: Date;

	@Column({
		name: "firebase_token",
		nullable: true
	})
	firebaseToken: string;


	/**
	 * Methods
	 */
	public async isFollowerOf(user: User): Promise<boolean> {
		const [data, count] = await Database.getRepository(UserFollower).findAndCountBy({
			follower: this.sub,
			following: user.sub
		})
		
		return count > 0
	}


	/**
	 * Relations
	 */
	@OneToOne(() => UserProfile, {
		cascade: true
	})
	@JoinColumn({
		name: "user_profile_id"
	})
	profile: UserProfile;

	@OneToMany(() => UserAudioCategory, userAudioCategory => userAudioCategory.user, {
		cascade: ["insert"]
	})
	audioCategories: UserAudioCategory[];

	@OneToMany(() => UserPictureCategory, userPictureCategory => userPictureCategory.user, {
		cascade: ["insert"]
	})
	pictureCategories: UserPictureCategory[];

	@OneToMany(() => UserVideoCategory, userVideoCategory => userVideoCategory.user, {
		cascade: ["insert"]
	})
	videoCategories: UserVideoCategory[];

	@OneToMany(() => Post, post => post.user)
	posts: Post[];

	@OneToMany(() => PostComment, postComment => postComment.user)
	comments: PostComment[];

	@OneToMany(() => PostReaction, postReaction => postReaction.user)
	reactions: PostReaction[];

	@OneToMany(() => SharedPost, SharedPost => SharedPost.user)
	sharedPosts: SharedPost[];

	@OneToMany(() => Message, message => message.from)
	sentMessages: Message[];

	@OneToMany(() => Message, message => message.to)
	receivedMessages: Message[];

	@OneToMany(() => Group, group => group.owner)
	ownedGroups: Group[];

	@OneToMany(() => Notification, notification => notification.user)
	notifications: Notification[];

	@OneToMany(() => SavedMedia, savedMedia => savedMedia.owner)
	savedMedias: SavedMedia[];
}