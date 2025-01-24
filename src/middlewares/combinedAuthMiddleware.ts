import { Request,Response,NextFunction } from "express";
import googleAuthMiddleware from "./googleAuthMiddleware";
import authMiddleware from "./authMiddleware";

// Combined Middleware Using JWT and Google Authentication Middleware.

const combinedAuthMiddleware = async(req:Request,res:Response,next:NextFunction) =>{
    // try with JWT
    const authHeader = req.headers["authorization"]
    console.log("Auth Header is : ",authHeader)
    // So Getting the Size of Token Because I want to Send a request to a route which is authenticated by middleware.
    // so which AuthType is Requesting like a user from googleAuth or JWT auth.. so as of in most cases jwt token size is 
    // arount 180 or 150.. and googleAuth token is above 1000..so i am calling middleware based on token size.. if it's under 
    // 200 i am calling JWT or if token size is greater that 200 i am googleAuth middleware.
    const size : number | any = authHeader?.length;
    if(size>201){
        console.log("Google Called")
        await googleAuthMiddleware(req,res,next);
        console.log("Google Called")
    }else if(size<200){
        console.log("JWT CALLED")
        await authMiddleware(req,res,next);
        console.log("JWT CALLED")
    }
}

export default combinedAuthMiddleware;





