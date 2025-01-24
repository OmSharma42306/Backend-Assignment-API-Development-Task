import mongoose from "mongoose";


// Created postsSchema for Storing Posts of all Users
const postSchema = new mongoose.Schema({
    
    imageUrl : {
        type:String
    },
    caption : {
        type:String,
        required:true
    },
    // linking the userId because of to jwt related user can relate their posts and can they view or post the posts according to their account.
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:false,
    },
    // linking the googleUserId because of to googleAuth related user can relate their posts and Can they View or post the Posts according to their account.
    googleUserId:{
        type : mongoose.Schema.Types.Mixed,
        ref : 'GoogleUser',
        required : false,
    },
    createdAt:{
        type:Date,
        default : Date.now
    }

});


// Creating Post model
const Post = mongoose.model('Post',postSchema)


export default Post;