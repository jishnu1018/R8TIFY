
import { Schema } from "mongoose";
import { model } from "mongoose";



const review = new Schema({
    name:{type:String,required:true},
    star:{type:String,required:true},
    title:{type:String,required:true},
    about:{type:String,required:true},
    image:{type:String},
    image2:{type:String}
},
{
    timestamps:true
})
const Review=model('Review',review)

export {Review}