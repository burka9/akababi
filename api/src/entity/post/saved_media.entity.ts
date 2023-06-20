import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";

@Entity()
export class SavedMedia {
	@PrimaryGeneratedColumn({
		name: "saved_media_id"
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
		nullable: true
	})
	imageContents: string[];

	@Column({
		type: "simple-array",
		name: "audio_contents",
		nullable: true
	})
	audioContents: string[];

	@Column({
		type: "simple-array",
		name: "video_contents",
		nullable: true
	})
	videoContents: string[];

	
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
		) throw new Error("Empty Media")
	}


	/**
	 * Relations
	 */
	@ManyToOne(() => User, user => user.savedMedias)
	@JoinColumn({
		name: "owner_user_id"
	})
	owner: User;
}