import { NextFunction, Request, Response } from "express";
import { error } from "../lib/errors";
import { DEVELOPMENT } from "../lib/env";
import { existsSync, rmSync } from "fs";

export const errorHandler = (error: error, req: Request, res: Response, next: NextFunction) => {
	const code = error.name === "QueryFailedError" ? 400 : error.code || 400

	// try removing uploaded files
	if (req.file) {
		existsSync(`uploads/${req.file.filename}`) && rmSync(`uploads/${req.file.filename}`)
	}
	if (req.files) {
		(req.files as Express.Multer.File[]).forEach(file => {
			existsSync(`uploads/${file.filename}`) && rmSync(`uploads/${file.filename}`)
		})
	}

	DEVELOPMENT && console.error(error)
	
	res.status(code).json({
		message: error.name,
		description: DEVELOPMENT ? error.message : null,
		data: error.data
	})
}