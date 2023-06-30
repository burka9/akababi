import { Response } from "express"

export const goodRequest = (res: Response, data?: Object, message = "Good Request", success = true) => {
	res.status(200).json({ success, message, ...data })
}

export const badRequest = (res: Response, message = "Bad Request") => {
	res.status(200).json({
		message,
		success: false
	})
}