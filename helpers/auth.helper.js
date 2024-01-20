import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export function verfiyToken(req,res,next){
    const token = req.headers['authorization'].split(' ')[1]; // extract token from header
    if (!token) { // check if token exists
      return res // return error response if token is not provided
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No token provided" }); 
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // verify token
      if (err) { // check if token is valid
        if(err.expiredAt < Date.now()){ // check if token is expired
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Token expired" });
        }
        return res // return error response if token is invalid
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid token" });
      }
      req.user = user; // set user in request
      next(); // call next middleware
    })
}