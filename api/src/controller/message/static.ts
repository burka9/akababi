import { LocationType } from "../../entity"
import { Message } from "../../entity/misc/message.entity"
import { User } from "../../entity/user/user.entity"
import { FileObject } from "../../lib/file_upload"

export const newMessage = (
	user: User,
	recipient: User,
	location: LocationType,
	text?: string,
	files?: FileObject,
	forwardFrom?: Message | null,
	replyTo?: Message | null,
	prev_message?: Message,
): Message => {
	let message: Message

	if (prev_message) {
		message = prev_message
	} else {
		message = new Message()
		message.audioMessage = []
		message.videoMessage = []
		message.pictureMessage = []
		message.location = location
		message.from = user
		message.to = recipient
	}

	if (text) {
		message.textMessage = text
	}

	if (forwardFrom) {
		message.forwardFrom = forwardFrom
	}

	if (replyTo) {
		message.replyTo = replyTo
	}

	// files
	if (files) {
		const { image, audio, video }: {
			image: Express.Multer.File[],
			audio: Express.Multer.File[],
			video: Express.Multer.File[],
		} = files

		if (image) image.forEach(file => message.pictureMessage.push(file.filename))
		if (audio) audio.forEach(file => message.audioMessage.push(file.filename))
		if (video) video.forEach(file => message.videoMessage.push(file.filename))
	}

	return message
}