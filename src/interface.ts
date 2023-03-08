import { Request as ExpressRequest } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface DecodedToken {
  email: string;
  role: string;
  Id: string;
}

interface Request extends ExpressRequest {
  decoded?: DecodedToken;
  needAccessToken?: boolean;
}
export default Request;
