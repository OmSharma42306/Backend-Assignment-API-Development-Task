import express from "express"
import Tasks from "../models/Tasks"
import { Request,Response } from "express";
import combinedAuthMiddleware from "../middlewares/combinedAuthMiddleware";

const router = express.Router();

// Creating a Interface for both googleUserId and userId because of in request will be going to contain this type of id's
interface AuthenticatedRequest extends Request{
    userId? : any;
    googleUserId?:any;
}


// an Post Request endpoint for Creating Tasks
router.post("/tasks",combinedAuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
    const name = req.body.name;
    const description = req.body.description;
    try{
        
    console.log("id",req.userId)
// create a new Task for Like JwtUsers based on userID.
        // like if userId avilable so the user will be JWT auth user.
        // so create the Task for jwtUser
    if(req.userId){
        const task = new Tasks({
            name:name,
            description:description,
            userId: req.userId
        });
        await task.save();
        res.status(200).json({task});
    }
        // create a new Task for Like GoogleUsers based on googleUserID.
        // like if googleUserId avilable so the user will be googleAuth user.
        // so create the Task for googleUser
    else if(req.googleUserId){
        const task = new Tasks({
            name:name,
            description:description,
            googleUserId: req.googleUserId
        });
        await task.save();
        res.status(200).json({task});
    }
    
    }catch(error){
        res.status(400).json({msg:"Couldnot Create Task"})
    }
    
})

// // get enpoint for getting tasks for their Respective Accounts
// Avoid this endpoint
// router.get("/tasks",combinedAuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
//     try{
        
//         const tasks = await Tasks.find({userId:req.userId});
//         console.log("User ID in middleware:", req.userId);
//         // Logs for Tasks 
//         console.log(tasks)

//     // so sending tasks above 0 because on frontend we are showing tasks, if tasks are 0 in case of fresh user, 
//     // that would be not valid so confirming and returning the tasks according to size of taks
//     if(tasks.length>0){
//         // logging tasks
//         console.log(tasks)

//         res.status(200).json(tasks)    
//     }else{
//         res.status(404).json({ message: "No tasks found." });
//     }
//     console.log(tasks)
//     }catch(error){
//         console.error("Error fetching tasks:", error);
//         res.status(500).json({ error: "Failed to fetch tasks." });
//     }
    

// });

// get enpoint for getting tasks for their Respective Accounts

router.get("/tasks",combinedAuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
    try{
        // for jwt user
        if(req.userId){
            const tasks = await Tasks.find({userId:req.userId});
        console.log("User ID in middleware:", req.userId);
        // Logs for Tasks 
        console.log(tasks)

    // so sending tasks above 0 because on frontend we are showing tasks, if tasks are 0 in case of fresh user, 
    // that would be not valid so confirming and returning the tasks according to size of taks
    if(tasks.length>0){
        // logging tasks
        console.log(tasks)

        res.status(200).json(tasks)    
    }else{
        res.status(404).json({ message: "No tasks found." });
    }
    console.log(tasks)

        }
        // for googleUser user
        else if(req.googleUserId){
            const tasks = await Tasks.find({googleUserId:req.googleUserId});
        console.log("User ID in middleware:", req.googleUserId);
        // Logs for Tasks 
        console.log(tasks)

    // so sending tasks above 0 because on frontend we are showing tasks, if tasks are 0 in case of fresh user, 
    // that would be not valid so confirming and returning the tasks according to size of taks
    if(tasks.length>0){
        // logging tasks
        console.log(tasks)

        res.status(200).json(tasks)    
    }else{
        res.status(404).json({ message: "No tasks found." });
    }
    console.log(tasks)
        }
        
        
    }catch(error){
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks." });
    }
    

});

// update tasks status on id

router.put("/tasks/:id",combinedAuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
    try{
    // getting id and status from Request of body and params
    const id = req.params.id;
    const status = req.body.status;
    
    // Finding the task on userid and updating the status
    const task = await Tasks.findByIdAndUpdate({_id:id,user:req.userId},{status:status},)
    res.json(task)
    }catch(error){
        console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task." });
    }
    

})


// Delete endpoin for a task on id
router.delete("/tasks/:id",combinedAuthMiddleware,async(req:AuthenticatedRequest,res:Response)=>{
    try{
        // getting id from Request paramas
        const id = req.params.id;
        // finding the task on Id and deleting it using mongoose function findByIdAndDelete by providing userId
    const task = await Tasks.findByIdAndDelete({_id:id,user:req.userId});
    if (!task) {
        res.status(404).json({ message: "Task not found." });
    }else{
        res.json({msg:"Task deleted!"})
    }
    
    }catch(error){
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task." });
    }
    

})


export default router;