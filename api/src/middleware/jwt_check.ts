import { auth } from "express-oauth2-jwt-bearer";
import { AUTH0, OFFLINE } from "../lib/env";
import offline_auth from "./offline_auth";

export const jwtCheck = OFFLINE ? offline_auth : auth({
  audience: AUTH0.AUDIENCE,
  issuerBaseURL: AUTH0.ISSUER,
  tokenSigningAlg: 'RS256'
})