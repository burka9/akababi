import { NextFunction, Request, Response } from "express";
import { error } from "../lib/errors";
import { DEVELOPMENT } from "../lib/env";
import { existsSync, rmSync } from "fs";
import { incomingRequestRepo } from "./incoming_request_handler";

export const errorHandler = async (error: error, req: Request, res: Response, next: NextFunction) => {
	let code = error.name === "QueryFailedError" ? 400 : error.code || 400
	code = isNaN(code) ? Number((error as any).statusCode || 400) : code

	// try removing uploaded files
	if (req.file) {
		existsSync(`uploads/${req.file.filename}`) && rmSync(`uploads/${req.file.filename}`)
	}
	if (req.files) {
		if ((req.files as Express.Multer.File[])[0]) { // array
			(req.files as Express.Multer.File[]).forEach(file => existsSync(`uploads/${file.filename}`) && rmSync(`uploads/${file.filename}`))
		} else if (Object.values(req.files)[0]) {
			Object.values(req.files).forEach(array => {
				array.forEach((file: Express.Multer.File) => existsSync(`uploads/${file.filename}`) && rmSync(`uploads/${file.filename}`))
			})
		}
	}

	DEVELOPMENT && console.error(error)

	// update incoming request
	const request = await incomingRequestRepo.findOneBy({ id: res.locals.request_id })
	if (request) {
		request.statusCode = code
		request.statusMessage = error.message
		request.responseAt = new Date()
		await incomingRequestRepo.save(request)
	}

	res.status(code).json({
		message: error.name,
		description: DEVELOPMENT ? error.message : null,
		data: error.data
	})
}