import { ColumnOptions } from "typeorm"

export enum MaritalStatus {
	Single = "Single",
	InARelationship = "InARelationship",
	Married = "Married",
	Divorced = "Divorced",
	Widow = "Wirdow",
}

export const LocationOptions: ColumnOptions = {
	type: "geometry",
	spatialFeatureType: "Point",
	srid: 4326,
	nullable: true,
	transformer: {
		from(value: string) {
			if (!value) return {}

			const [longitude, latitude] = value.substring(6, value.length-1).split(" ")
			return { longitude, latitude }
		},
		to({ longitude, latitude }: { longitude: number, latitude: number}) {
			return `POINT(${longitude} ${latitude})`
		},
	},
}

export const UniqueNameOptions: ColumnOptions = {
	unique: true,
	transformer: {
		from(value) {
				return value ? value.toLowerCase() : value
		},
		to(value) {
				return value
		},
	}
}

export type LocationType = { longitude: number, latitude: number}

export enum NotificationType {
	NewFollower = "NewFollower",
	PostReaction = "PostReaction",
	PostComment = "PostComment",
	PostShare = "PostShare",
	NewMessage = "NewMessage",
}

export enum Privacy {
	Everyone = "Everyone",
	NearMe = "NearMe",
	GroupMembers = "GroupMembers",
	Followers = "Followers",
	OnlyMe = "OnlyMe",
}

export enum Gender {
	male = "male",
	female = "female"
}