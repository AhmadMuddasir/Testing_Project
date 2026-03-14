import jwt from "jsonwebtoken"
import { config } from "../config/config"
import createHttpError from "http-errors"
const authenticate = (req,res,next)=>{
     const token = req.header("Authorization")?.replace("Bearer", "");
     if(!token){
          return next(createHttpError(401,"access token is required"));
     }
     
     try {
          const decoded = jwt.verify(token,config.jwtSecret);
          req.userId = decoded.sub;
          next();
     } catch (error) {
     return next(createHttpError(401, "Invalid or expired token"));
     }
}

export default authenticate;