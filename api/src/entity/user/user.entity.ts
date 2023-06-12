import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../post/post.entity";
import { PostComment } from "../post/post.comment.entity";
import { PostReaction } from "../post/post.reaction.entity";
import { UserProfile } from "./user.profile.entity";
import { PrivacySetting } from "./user.privacy.entity";
import { UserFollower } from "./user.follower.entity";

@Entity()
export class User {
	@Column({ primary: true })
	sub: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ unique: true })
	@IsEmail()
	email: string;

	@Column({
		type: "geometry",
		spatialFeatureType: "Point",
		srid: 4326,
		select: false,
		nullable: true
	})
	location: string;

	@OneToMany(() => Post, post => post.user)
	posts: Post[];

	@OneToMany(() => PostComment, postComment => postComment.user)
	comments: PostComment[];

	@ManyToOne(() => PostReaction, postReaction => postReaction.user)
	postReaction: PostReaction;

	@OneToOne(() => UserProfile, { cascade: true })
	@JoinColumn()
	profile: UserProfile;

	@OneToOne(() => PrivacySetting, { cascade: true })
	@JoinColumn()
	privacy: PrivacySetting;

	@OneToMany(() => UserFollower, userFollower => userFollower.follower)
	following: UserFollower[];

	@OneToMany(() => UserFollower, userFollower => userFollower.following)
	followers: UserFollower[];
}