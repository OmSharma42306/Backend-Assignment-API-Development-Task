import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import rootRouter from "./api/index"

// Initializing Express App
const app = express();
// Defining PORT 
const PORT = 3000

// Using some middleware like bodyParser to read JSON from frontned 
app.use(bodyParser.json());

// using this to enable Cross-Origin Resource Sharing
app.use(cors());

// using the base Root Router.
app.use("/api/v1",rootRouter);

// Defining just basic route 

app.get('/',async(req:Request|any,res:Response|any)=>{
    
    return res.json({msg:"I am from Backend!"});
    
})

app.listen(PORT,()=>{
    console.log(`Server Started at PORT :${PORT}`)
})