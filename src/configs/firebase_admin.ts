import admin from "firebase-admin"
import dotenv from "dotenv"
dotenv.config();  // to Read env Variables from .env file.


// Firebase Configuration For Initializing App
admin.initializeApp({
    credential:
    admin.credential.cert({
        projectId : process.env.project_id,
        clientEmail : process.env.client_email,
        privateKey : process.env.private_key
    }),
})


// Verifying Token of Google Authentication
export const verifyToken = async (token:string) => {
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }catch(error){
        throw new Error("Invalid token")
    }
}