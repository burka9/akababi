import { NextFunction, Request, Response } from "express"
import { CustomError, CustomErrorName } from "../lib/customError"
import logger from "../lib/logger"
import { auth } from "express-oauth2-jwt-bearer"
import { AUTH0, GEOLOCATION } from "../lib/env"
import axios from "axios"

export function errorHandler(error: Error | CustomError, req: Request, res: Response, next: NextFunction) {
	logger.error(`Route "${req.url}": ${error}`)
	if (error.name === 'QueryFailedError') {
		return res.status(400).json({ message: 'Bad Request', code: (error as any).code })
	} else if (error.name === CustomErrorName) {
		return res.status((error as any).code || 400).json({ message: error.message })
	}
	return res.status(500).json({ message: 'Server error' })
}

export const jwtCheck = auth({
  audience: AUTH0.AUDIENCE,
  issuerBaseURL: AUTH0.ISSUER,
  tokenSigningAlg: 'RS256'
})

export const IncludeLocation = async (req: Request, res: Response, next: NextFunction) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	const location = (await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${GEOLOCATION.API_KEY}&ip=${ip}`)).data
	const locationString = `ST_GeomFromText("POINT(${location.longitude} ${location.latitude})")`

	res.locals.location = location
	res.locals.locationString = locationString

	next()
}

export const Debug = (req: Request, res: Response, next: NextFunction) => {
	logger.debug('debug start ------------------')
	logger.debug('debug end ------------------')

	next()
}