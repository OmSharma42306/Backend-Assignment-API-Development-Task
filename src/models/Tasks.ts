import mongoose from "mongoose";
import { object } from "zod";

const taskSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum: ['pending','completed','done'],
        default : 'pending'
    },
    // linking the userId because of to jwt related user can relate their tasks and can they view or create the tasks,delete the tasks according to their accounts.
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : false,
    },
    // linking the googleUserId because of to googleAuth related user can relate their tasks and can view or create their tasks ,delete the tasks, according to their accounts.
    googleUserId:{
        type : mongoose.Schema.Types.Mixed,
        ref : 'GoogleUser',
        required:false
    }
})

// Creating Tasks Model
const Tasks = mongoose.model('Tasks',taskSchema);

export default Tasks;