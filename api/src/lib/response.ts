import { Response } from "express"
import { incomingRequestRepo } from "../middleware/incoming_request_handler"

export const goodRequest = async (res: Response, data?: Object, message = "Good Request", success = true, statusCode = 200) => {
	// update incoming request
	const request = await incomingRequestRepo.findOneBy({ id: res.locals.request_id })
	if (request) {
		request.statusCode = statusCode
		request.statusMessage = message
		request.responseAt = new Date()
		await incomingRequestRepo.save(request)
	}

	res.status(statusCode).json({ success, message, ...data })
}

export const badRequest = async (res: Response, message = "Bad Request", statusCode = 200) => {
	// update incoming request
	const request = await incomingRequestRepo.findOneBy({ id: res.locals.request_id })
	if (request) {
		request.statusCode = statusCode
		request.statusMessage = message
		request.responseAt = new Date()
		await incomingRequestRepo.save(request)
	}

	res.status(200).json({
		message,
		success: false
	})
}