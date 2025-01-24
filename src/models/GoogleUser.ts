import mongoose from "mongoose";

// Created GoogleUserSchema for Storing GoogleAuth Users

const GoogleUserSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    email : {
        type : String,
        required:true
    }

});

// Creating Model of GoogleUser
const GoogleUser = mongoose.model('GoogleUser',GoogleUserSchema);

// Exporting the Model
export default GoogleUser;