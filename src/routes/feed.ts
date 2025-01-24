// Importing Neccessary Imports like Cloudinary Config , CombinedAuthMiddleware
import express from "express";
import Post from "../models/Post";
import { Request,Response } from "express";
import multer  from "multer"; // Middleware for Hanlding File Uploads.
import {v2 as cloudinary} from "cloudinary"
import combinedAuthMiddleware from "../middlewares/combinedAuthMiddleware";
import dotenv from "dotenv"


dotenv.config();


// Configuration of Cloudinary and Reading all configs like api_key,cloud_name,api_secret from .env file
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

// Multer Setup for File Uploads.

const storage = multer.diskStorage({});
const upload = multer({storage})

const router = express.Router();

router.post("/createPost",combinedAuthMiddleware,upload.single('photo'),async(req:any,res:Response):Promise<void>=>{
    try{
        
        const caption = req.body.caption;
        const userId = req.body.userId ;
        const googleUserId = req.body.googleUserId;
        const image = req.file.path;
        
        // Adding Logs to Confirm the Route is Correctly Doing All Stuff 
        console.log("GoogleUserId: ",googleUserId)
        console.log("JWT USERID: ",userId)
        console.log("images: ", image)
        
        // Uploading image to cloudinary
        const result = await cloudinary.uploader.upload(image);
        console.log("result: ",result)

        // create a new Post for Like GoogleUsers based on googleUserID.
        // like if googleUserId avilable so the user will be googleAuth user.
        // so create the post for googleUser

        if(googleUserId && !userId){
            console.log("Creating post for Google-authenticated user...");
            const newPost = new Post({
            imageUrl:result.secure_url,
            caption:caption,
            googleUserId:googleUserId
            
            })
            await newPost.save();
            console.log("New Post",newPost)
            console.log("Google User Post Created:", newPost)
            // await newPost.save();
            // console.log("google POSTFFFFFFFFFFFFFFFFF")
             res.status(201).json({message:"Post Created Successfully!",post:newPost});
             return
    
        }
        // create a new Post for Like JWT Users based on userID.
        // like if userId avilable so the user will be jwt auth user.
        // so create the post for jwtauth
        else if(userId && !googleUserId){

            console.log("Creating post for JWT-authenticated user...");
            
            const newPost = new Post({
                imageUrl:result.secure_url,
                caption:caption,
                userId:userId
            });
            await newPost.save();
            // Some logs for confirming the Post is Created by JWT user
            console.log("New Post",newPost)
            console.log("JWT User Post Created:", newPost);
            res.status(201).json({message:"Post Created Successfully!",post:newPost});
            return
    
        
        }else{
             // Handle invalid request where both or none of the IDs are present
             res.status(400).json({ message: "Invalid request: Provide either userId or googleUserId, not both or none." });
             return 
        }
        
    }catch(error){  
        console.error(error)
        res.status(400).json({message : "Error Creating Message!",error});

    }
})

router.get("/getAllPost",combinedAuthMiddleware,async (req:Request,res:Response)=>{
    try{
        // Finding all Post and Populate by Some fields to get Relevent Data from Posts Model
        const posts = await Post.find()
        .populate('userId', 'name') // Populate `userId` and include only the `name` field
        .then(posts => {
            res.json({ posts });
        });
    
    }catch(error){
        res.json({error});
    }
    
})


export default router