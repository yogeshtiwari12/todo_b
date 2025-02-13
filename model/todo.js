import mongoose from "mongoose";
const todo_Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDays: {
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    uid:{
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  
},
{ timestamps: true } 

)
const todomodel = mongoose.model('todo_model', todo_Schema);
export default todomodel;