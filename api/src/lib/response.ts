import { Request, Response } from "express"

type options = [string, any] | any

export const goodRequest = (req: Request, res: Response, data?: options, message = "Good Request", success = true) => {
	let [key, value]: [string, any] = ["data", data]

	if (data) {
		key = data instanceof Array && data.length >= 2 ? data[1] : "data"
		value = data instanceof Array ? data[0] : data
	}

	res.status(200).json({
		success, message,
		[key]: value
	})
}

export const badRequest = (req: Request, res: Response, message = "Bad Request") => {
	res.status(200).json({
		message,
		success: false
	})
}