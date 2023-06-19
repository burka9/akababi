/**
 * every request made to the api should include the following query properties
 * 
 * longitude
 * latitude
 * timestamp
 * 
 */


export interface _CategoryTag {
	category_tag_id: number;
	name: string;
}

export interface _ReactionTag {
	reaction_tag_id: number;
	name: string;
}

export enum _MaritalStatus {
	Single = "Single",
	InARelationship = "InARelationship",
	Married = "Married",
	Divorced = "Divorced",
	Widow = "Wirdow",
}

export enum _Privacy {
	Everyone = "Everyone",
	NearMe = "NearMe",
	GroupMembers = "GroupMembers",
	Followers = "Followers",
	OnlyMe = "OnlyMe",
}

export const _DefaultPrivacy = _Privacy.Everyone

export interface _User {
	user_id: string; // primary key
	user_sub: string; // primary key
	created_at: Date;

	email: string; // unique email
	phone: string; // unique phone number
	location: string; // latest location of where the user is located

	profile: _UserProfile; // foreign key: user_profile_id
}

export interface _UserProfile {
	user_profile_id: number;

	first_name: string;
	last_name: string;
	birthday: Date; // date is stored in gregorian calendar
	marital_status: _MaritalStatus;
	nationality: string;

	is_a_new_user: boolean;

	profile_picture: _ProfilePicture; // foreign key: profile_picture_id

	privacy: _Privacy; // control who can view the user's profile
}

// user_multimedia_category is where users can create their own category to store multimedia files
// this interface will not be created as a table
export interface _UserMultimediaCategory {
	created_at: Date;

	name: string;
	type: "picture" | "audio" | "video"; // define the type of the category

	// control who can see the contents of the category
	// contents of the category will inherit this property
	privacy: _Privacy;

	user: _User; // the owner of the entity
}

// one default category is created for every user: "my_pictures"
export interface _UserPictureCategory extends _UserMultimediaCategory {
	user_picture_category_id: number;
	type: "picture";
}

// one default category is created for every user: "my_audio"
export interface _UserAudioCategory extends _UserMultimediaCategory {
	user_audio_category_id: number;
	type: "audio";
}

// one default category is created for every user: "my_videos"
export interface _UserVideoCategory extends _UserMultimediaCategory {
	user_video_category_id: number;
	type: "video";
}

// lets users store pictures
export interface _UserPicture {
	user_picture_id: number;
	created_at: Date;

	picture_path: string;

	// the category which the picture belongs to
	// foreign key: picture_category_id
	picture_category: _UserPictureCategory;

	// controls who can view this particular content
	// individual privacy setting can override the inherited value
	privacy: _Privacy;
}

// lets users store audio
export interface _UserAudio {
	user_audio_id: number;
	created_at: Date;

	audio_path: string;

	// the category which the audio belongs to
	// foreign key: audio_category_id
	audio_category: _UserAudioCategory;

	// controls who can view this particular content
	// individual privacy setting can override the inherited value
	privacy: _Privacy;
}

// lets users store videos
export interface _UserVideo {
	user_video_id: number;
	created_at: Date;

	video_path: string;

	// the category which the video belongs to
	// foreign key: video_category_id
	video_category: _UserVideoCategory;

	// controls who can view this particular content
	// individual privacy setting can override the inherited value
	privacy: _Privacy;
}

export interface _ProfilePicture {
	profile_picture_id: number;

	user_picture: _UserPicture; // foreign_key: user_picture_id
	privacy: _Privacy; // controls who can view the user's profile picture
}

export interface _UserFollower {
	follower: _User; // primary key
	following: _User; // primary key
}

export interface _Post {
	post_id: number;
	created_at: Date;

	text_content: string;
	image_contents: string[];
	audio_contents: string[];
	video_contents: string[];

	location: string; // location of where the post was created
	relevance: number; // post relevance can be increased to make the post a trending post. number of views, reactions and comments can affect the relevance.
	views: number; // show how many views the post has

	category: _CategoryTag; // foreign_key: category_tag_id
	group_id: _Group; // foreign_key: group_id

	privacy: _Privacy; // control who can see the post
	comment_privacy: _Privacy; // control who can comment on the post
	reaction_privacy: _Privacy; // control who can react to the post
}

export interface _PostComment {
	post_comment_id: number;
	created_at: Date;

	text_comment: string;
	image_comment: string;
	audio_comment: string;
	video_comment: string;

	location: string;

	user: _User; // foreign key: user_id
	post: _Post; // foreign key: post_id
}

export interface _PostReaction {
	post_reaction_id: number;
	created_at: Date;

	reaction: _ReactionTag; // foreign key: reaction_tag_id

	user: _User; // foreign key: user_id
	post: _Post; // foreign key: post_id
}

export interface _SharedPost {
	shared_post_id: number;
	created_at: Date;

	location: string;

	original_post: _Post; // foreign key: post_id
	sharing_user: _User; // foreign key: user_id

	privacy: _Privacy; // control who can see the shared post
}

export interface _SavedMedia {
	saved_media_id: number;
	created_at: Date;

	original_post: _Post; // foreign key: post_id

	text_content: string;
	image_contents: string[];
	audio_contents: string[];
	video_contents: string[];
}

/**
 * List of notification types
 * 
 * new follower
 * post reaction
 * post comment
 * post share
 * new message
 * 
 */
export enum _NotificationType {
	NewFollower = "NewFollower",
	PostReaction = "PostReaction",
	PostComment = "PostComment",
	PostShare = "PostShare",
	NewMessage = "NewMessage",
}

export interface _Notification {
	notification_id: number;
	created_at: Date;

	notification_type: _NotificationType;
	is_read: boolean;

	target_user: _User; // foreign key: user_id
	target_post: _Post; // foreign key: post_id
	target_post_comment: _PostComment; // foreign key: post_comment_id
	target_message: _Message; // foreign key: message_id
}

export interface _Message {
	message_id: number;
	created_at: Date;

	text_message: string;
	audio_message: string;
	video_message: string;

	is_read: boolean;

	forward_from: _Message; // foreign key: message_id
	reply_to: _Message; // foreign key: message_id

	from: _User; // foreign key: user_id
	to: _User; // foreign key: user_id
}

export interface _Country {
	country_id: number;
	original_name: string;
	english_name: string;
	code: string;
}

export interface _City {
	city_id: number;
	original_name: string;
	english_name: string;
}

/**
 * group rule controls who can join the group based on:
 * 
 * nationality
 * location: city, country
 * age
 * 
 */ 
export interface _GroupRule {
	group_rule_id: number;

	min_age: number;
	max_age: number;

	eligible_nationality: string[];
	eligible_country: _Country[]; // foreign key: country_id
	eligible_city: _City[]; // foreign key: city_id
	
	exclude_nationality: string[];
	exclude_country: _Country[]; // foreign key: country_id
	exclude_city: _City[]; // foreign key: city_id
}

export interface _Group {
	group_id: number;
	created_at: Date;

	name: string;
	location: string;

	parent: _Group;// foreign key: group_id
	rule: _GroupRule; // foreign key: group_rule_id

	post_privacy: _Privacy; // control who can see the group's posts
	member_privacy: _Privacy; // control who can see the group's memebers
}
