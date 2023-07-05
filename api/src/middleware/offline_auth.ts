import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../lib/errors";
import logger from "../lib/logger";
import axios from "axios";
import { OFFLINE_AUTH_URL } from "../lib/env";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const response = await axios.get(`${OFFLINE_AUTH_URL}/verify`, {
			headers: {
				Authorization: req.headers.authorization
			}
		})
		
		if (response.data === "OK") return next()
	} catch(err: any) {
		logger.debug(err.message)
	}

	throw new Unauthorized()
}