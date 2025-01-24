import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Creating a Transporter to using mail service confiuration
const transporter = nodemailer.createTransport({
    service:process.env.service,  // reading the service variable from .env.. for example : Gmail,any mail providers
    auth:{
        user: process.env.user,   // reading the user variable from .env 
        pass: process.env.pass    // reading the pass variable from .env 
    }
})


export default transporter;