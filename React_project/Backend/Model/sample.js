
import { Schema } from "mongoose";
import { model } from "mongoose";



const signup = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    confirm:{type:String,}
},
{
    timestamps:true
})
const SIGNUP=model('Signup',signup)

export {SIGNUP}