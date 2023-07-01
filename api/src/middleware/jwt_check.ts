import { auth } from "express-oauth2-jwt-bearer";
import { AUTH0 } from "../lib/env";

export const jwtCheck = auth({
  audience: AUTH0.AUDIENCE,
  issuerBaseURL: AUTH0.ISSUER,
  tokenSigningAlg: 'RS256'
})