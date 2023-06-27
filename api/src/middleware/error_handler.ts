import { NextFunction, Request, Response } from "express";
import { error } from "../lib/errors";

export const errorHandler = (error: error, req: Request, res: Response, next: NextFunction) => {
	const code = error.name === "QueryFailedError" ? 400 : error.code || 400
	
	res.status(code).json({
		message: error.message,
		data: error.data
	})
}