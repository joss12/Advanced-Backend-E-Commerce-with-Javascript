import { User } from "../models/User.js";
import ErrorCatch from "../utils/error.js";
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import { asyncError } from "./err.handler.js";

export const isAuthenticated = asyncError( async(req, res, next) =>{

    // const token = req.cookies.token
    try {
    const {token} = req.cookies;
    if(!token) return next(new ErrorCatch("Not authorized", 401));
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedData._id);
    req.user = user;
    next()
    } catch (error) {
        next(error)
    }

});


export const isAdmin = asyncError(async (req, res, next) => {
    if (req.user.role !== "admin")
      return next(new ErrorHandler("Only Admin allowed", 401));
    next();
  });