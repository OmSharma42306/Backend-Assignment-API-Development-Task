import { Request,Response,NextFunction } from "express";
import admin from "firebase-admin"


// Creating Interface for Requests Containing googleUserId
interface AuthenticatedRequest extends Request{
    googleUserId? : string;
}


// Implementing Google Auth Middleware

const googleAuthMiddleware = async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({error: "Unauthorized! No Token Provided!"});
        return 
    }

    // Extracting Token from Bearer "Token" 
    const token = authHeader.split(" ")[1];
    try{
        const decodedToken:any= await admin.auth().verifyIdToken(token);
        req.googleUserId = decodedToken.uid;
        console.log("User ID in middleware:", req.googleUserId);
        // calling next() to go to prcess the route or the route is Accessed by Valid User.
        next();
    }catch(error){
        console.error("Error Verifying Firebase Token: ,",error);
        res.status(401).json({error:"Unauthorized Invalid Token"})
    }

}

export default googleAuthMiddleware;