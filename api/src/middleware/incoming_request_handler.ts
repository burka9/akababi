import { NextFunction, Request, Response } from "express";
import logger from "../lib/logger";
import { Database } from "../database";
import { IncomingRequest } from "../entity/log/request.entity";

export const incomingRequestRepo = Database.getRepository(IncomingRequest)

export const incomingRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	logger.debug(`incoming request: ${req.url}`)
	
	const request = new IncomingRequest()
	request.createdAt = new Date()
	request.headers = JSON.stringify(req.headers)
	request.method = req.method
	request.query = JSON.stringify(req.query)
	request.params = JSON.stringify(req.params)
	request.body = JSON.stringify(req.body)
	request.url = req.url
	request.ip = req.ip

	await incomingRequestRepo.save(request)

	res.locals.request_id = request.id
	
	next()
}