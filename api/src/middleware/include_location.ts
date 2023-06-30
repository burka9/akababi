import { NextFunction, Request, Response } from "express";
import { NoLocation } from "../lib/errors";
import logger from "../lib/logger";

export const IncludeLocation = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.locals.location = JSON.parse(req.headers.coordinates as string)

		next()
	} catch(err: any) {
		logger.error(err.message)
		throw new NoLocation()
	}
}