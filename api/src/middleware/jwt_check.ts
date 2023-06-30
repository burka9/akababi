import { auth } from "express-oauth2-jwt-bearer";
import { AUTH0, OFFLINE, OFFLINE_URL } from "../lib/env";
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Unauthorized } from "../lib/errors";

const offlineAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = await axios.post(`${OFFLINE_URL}/verify`, {}, {
      headers: {
        Authorization: req.headers.authorization
      }
    })

    if (data.success) return next()
  } catch {
  }
  throw new Unauthorized()
}

export const jwtCheck = OFFLINE ? offlineAuth : auth({
  audience: AUTH0.AUDIENCE,
  issuerBaseURL: AUTH0.ISSUER,
  tokenSigningAlg: 'RS256'
})