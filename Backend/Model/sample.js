
import { Schema } from "mongoose";
import { model } from "mongoose";



const signup = new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    confirm:{type:String,},
    role:{type:String,required:true}
},
{
    timestamps:true
})
const SIGNUP=model('Signup',signup)

export {SIGNUP}