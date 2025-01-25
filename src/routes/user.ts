import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Request,Response } from "express";
import Users from "../models/Users";
import transporter from "../services/emailService";
import crypto from "crypto"
import dotenv from "dotenv"
import { verifyToken } from "../configs/firebase_admin";
import GoogleUser from "../models/GoogleUser";
import {signUpInput,loginInput} from "../zodValidation/Validation"

dotenv.config();

const router = express.Router();
const JWT_SECRET : string | any = process.env.JWT_SECRET;


// Creating endpoint for SignUp
router.post('/signup',async(req:Request|any,res:Response|any)=>{
    
    // getting body for Validation 
    const body =  req.body
    
    // Validating the body data using Zod Validation
    const {success} = signUpInput.safeParse(body)
    
    console.log(success)
    
    // success false , then it returns message Invalid Inputs
    if(!success){
        return res.json({msg:"Invalid Inputs"})
    }

    // success true , then it creates account
    if(success){
          
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
        try{
            // Checking is There anyone Existing User with given Email in body
            const checkExistingUser = await Users.findOne({email:email});
        // if user exists then it return that user alredy exists!
            if(checkExistingUser){
            
            return res.json({msg:"User Already Exists!"})
        }
    
        // Hashing Password for Security Reasons
        const hashedPassword = await bcrypt.hash(password,10);
    
    
        // Creating new User Object for MongoDB database
        const newUser = new Users({
            name:name,
            email:email,
            password:hashedPassword,
        })
        
        // Saving into Database
        await newUser.save();
        
        const userId = newUser._id;
        const token = jwt.sign({userId},JWT_SECRET)
        return res.status(200).json({msg:"New User Created!",token:token})
        }catch(error){
            return res.json({msg:error});
        }
    }
  
})


// Login enpoint for Users

router.post('/login',async(req:Request | any,res:Response | any)=>{
    // getting body for Validation 
    const body =  req.body;

    // Validating the body data using Zod Validation
    const {success} = loginInput.safeParse(body);
    
    console.log(success)
    
    // success false , then it returns message Invalid Inputs
    if(!success){
        return res.status(400).json({msg:"Invalid Inputs!"})
    }
    
    const email = req.body.email;
    const password = req.body.password;
    try{
         // Checking is There anyone Existing User with given Email in body
        const checkUser = await Users.findOne({email:email});

        // if user exists then it return that user alredy exists!
        if(!checkUser){
            return res.status(400).json({msg:"User Not Found! Register User!"})
        }
        
        // Decrypting Password from database with Given password in body
        const isPasswordInvalid = await bcrypt.compare(password,checkUser.password);
        
        // if Password is Wrong then it returns Invalid Credentials!
        if(!isPasswordInvalid){
            return res.status(400).json({msg:"Invalid Credentials!"});
        }

        // Creating jwt token
        const token = jwt.sign({userId:checkUser._id},JWT_SECRET,{expiresIn:'2h'})
        return res.status(200).json({msg:"Login Successful!",token:token})


    }catch(error){
        return res.status(500).json({ msg: "Login Failed!", error });
    }
})


// Creating endpoint for Forgot Password
router.post('/forgot-password',async(req:Request | any,res: Response | any)=>{
    const email = req.body.email;

    try{
        // Checking user exist on database to verify like valid user to forgot password
        const user = await Users.findOne({email:email});
        
        // if user didn't exists then returns user not found!
        if(!user){
            return res.status(400).json({msg:"User not Found!"})
        }

        // generate otp.
        
        const otp = crypto.randomInt(100000,999999).toString();
        
        // setting expiry to otp
        const otpExpiry = new Date(Date.now() + 10*60*1000); // otp valid for 10 minutes.   

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();



        // send otp via email! mail Configuration
        const mailOptions = {
            from : process.env.user,        // Reading From env file , sender email to all users
            to : email,                     // to : who is going to forgot the password and receiving otp to this email
            subject : "Password Reset OTP", // subject : in mailbox the message start with "Password Reset OTP"
            text : `Your OTP for Password Reset is : ${otp}`, // text : body of email like containing the Reset OTP
        }

        await transporter.sendMail(mailOptions); // sending mail using above configurations
        res.status(200).json({message:"OTP sent to your email!"})

    }catch(error){
        return res.status(400).json({msg:error});
    }
})


// verify otp endpoint

router.post('/verify-otp',async(req:Request | any, res:Response | any)=>{
    
    // Reading email and otp from body
    const email = req.body.email;
    const otp = req.body.otp;

    try{
        // finding user with email provided by body
        const user = await Users.findOne({email:email});
        
        // if not user exist then return user not found!
        if(!user) return res.status(400).json({msg:"User Not Found!"});

        // like comparing otp stored in database with otp provided by user or body.
        // if it fails then send message like Invalid OTP or Expired OTP
        if(user.otp !== otp){
            return res.status(401).json({msg:"Invalid otp or Expired Otp!"});

        }
        // so above case passing then it would be correct otp.
        // so reset the otp field and otpExpiry field to null in database
        user.otp = null
        user.otpExpiry = null
        await user.save();
        // after saving userdata sending message like OTP verified please reset the password!
        res.status(200).json({status:"Success",msg:"OTP Verified!, Proceed to Reset Password!"})
    }catch(error){
        return res.status(400).json({msg:error})
    }
})

// endpoint for reset password!
router.post('/reset-password',async(req:Request | any, res:Response | any)=>{

// Reading email and password from body
const email = req.body.email;
const password = req.body.firstPassword;

try{
    // finding user with email provided by body
    const user = await Users.findOne({email:email});
    
    // if not user exist then return user not found!
    if(!user){
        return res.status(401).json({msg:"User not Found!"})
    }
    console.log("user " ,user)
    // hashing the password , so after decrypting at loginpage,if not hashed password here,at login time that will throw error!
    const hashedPassword = await bcrypt.hash(password,10);
    // setting the database password with given password by user from body.
    user.password = hashedPassword;
    await user.save();
    console.log("after updating the user:,",user)
    // sending message that password reset successfully!
    return res.status(200).json({status:"Success",msg:"Password reset Successfully!"});

}catch(error){
    return res.status(400).json({msg:error});
}
})



// google signin endpoint
router.post('/api/auth/google',async(req:Request,res:Response)=>{
    const token = req.body.token;
    try{
        const decodedToken = await verifyToken(token);
        const email = decodedToken.email;
        const name = decodedToken.name;
        console.log("Email: ",email)
        console.log("Name,",name)

        if(!email || !name){
            res.status(400).json({msg:"Missing email or Name in Token"})
        }
        // finding googleUser that it exists on googleUser database
        let googleUser = await GoogleUser.findOne({email:email});
        // if not then saves to GoogleUser model
        if(!googleUser){
             googleUser = new GoogleUser({
                name:name,
                email:email
            })
            await googleUser.save();
        }

        // sending message authenticated with token by googleAuth
        res.status(200).json({message:"Authenticated",user:decodedToken});

    }catch(error){  
        // if anything error raises sends Invalid Token
        res.status(401).json({message:"Invalid Token"})
    }
})


export default router