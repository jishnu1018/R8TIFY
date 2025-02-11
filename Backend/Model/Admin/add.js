
import { Schema } from "mongoose";
import { model } from "mongoose";



const productt = new Schema({
    Product_name:{type:String,required:true},
    Product_description:{type:String,required:true},
    price:{type:String,required:true},
    image:{type:String},
    image2:{type:String}
},
{
    timestamps:true
})
const PROduct=model('Product',productt)

export {PROduct}