import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

// Creating Interface for userId 
interface AuthenticatedRequest extends Request{
    userId? : string;
}

// Reading JWT SECRET CODE from .env file
const JWT_SECRET : string | any = process.env.JWT_SECRET;


// Initializing a AuthMiddleware for JWT Authenticated Users.
async function authMiddleware(req:AuthenticatedRequest,res:Response,next:NextFunction): Promise<void>{
const authHeader = req.headers["authorization"];

// Checking if Authorization Header that authHeader exists or not and if exist Contains "Bearer" at starting or not!
if(!authHeader || !authHeader.startsWith('Bearer')){
    res.status(401).json({msg:"Authorization Header is Missing!"})
    return ;
}

// to extract the token spliting the Bearer
const token = authHeader.split(' ')[1];

try{
    // Verifying the Token
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    // calling next() to go to prcess the route or the route is Accessed by Valid User.
    next();
}catch(error){
    console.error("JWT verification failed:", error);
    res.status(400).json({msg:"Middleware Failed!"})
}
}

export default authMiddleware;