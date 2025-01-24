import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

// Reading MongoDB url from .env file
const mongoUrl = process.env.MONGODB_URI || "";

// Connecting to MongoDB using URL
mongoose.connect(mongoUrl).then(()=>{
    console.log("Database Connected!")
})

// Creating UserSchema for Storing UserInfo
const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    email : {
        type : String,
        required:true,
        unique:true
    },
    password : {
        type : String,
        required:true
    },
    otp:{
        type:String,
    },
    otpExpiry : {
        type:Date
    }
});



// Creating User Model 
const Users = mongoose.model('Users',userSchema);



export default Users;