
import { Schema } from "mongoose";
import { model } from "mongoose";



const adminsignup = new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true}
})
const Adminsign=model('AdminSignup',adminsignup)

export {Adminsign}