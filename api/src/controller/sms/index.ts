import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { BadFields } from "../../lib/errors";
import axios from "axios";
import { goodRequest } from "../../lib/response";
import logger from "../../lib/logger";
import { error } from "../../lib/errors";
import { AUTH0, SMS } from "../../lib/env";

class SMSController {
	async sendSMS(req: Request, res: Response) {
		logger.info(`send sms request: ${req.url}`)
		const result = validationResult(req)
		if (!result.isEmpty()) {
			logger.error(`send sms request failed: bad fields`)
			throw new BadFields()
		}

		const { recipient: to, body: message } = matchedData(req)

		try {
			const response = await axios.post(SMS.URL, {
				to, message,
				token: SMS.TOKEN,
				template_id: 'otp'
			})

			logger.info(`send sms request completed: ${response.data.message}`)
			goodRequest(res)
		} catch (err: any) {
			logger.error(`send sms request failed (${err.response.status}): ${err.message}`)
			throw new error(err.message)
		}
	}

	async verifyOTP(req: Request, res: Response) {
		logger.info(`verify otp request: ${req.url}`)
		const result = validationResult(req)
		if (!result.isEmpty()) {
			logger.error(`verify otp request failed: bad fields`)
			throw new BadFields()
		}

		const { username, otp } = matchedData(req)

		try {
			const response = await axios.post(`${AUTH0.DOMAIN}/oauth/token`, {
				username, otp,
				grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
				client_id: AUTH0.CLIENT_ID,
				client_secret: AUTH0.CLIENT_SECRET,
				realm: "sms",
				audience: AUTH0.AUDIENCE,
				scope: "openid"
			})

			goodRequest(res, { ...response.data })
		} catch (err: any) {
			logger.error(`verify otp request failed (${err.response.status}): ${err.message}`)
			throw new error(err.message)
		}
	}
}

export default new SMSController()