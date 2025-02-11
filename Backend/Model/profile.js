
import { Schema } from "mongoose";
import { model } from "mongoose";



const profile = new Schema({
    name:{type:String,required:true},
    phn_no:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String}
},
{
    timestamps:true
})
const PROFILE=model('PROFILE',profile)

export {PROFILE}