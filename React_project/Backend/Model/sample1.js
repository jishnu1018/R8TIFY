import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {

    productId: { type: Types.ObjectId, ref: "Product", required: true }, // Referencing Product schema
    userId: { type: Types.ObjectId, ref: "User", required: true },
    star: { type: Number, required: true }, // Changed to Number
    title: { type: String, required: true },
    about: { type: String, required: true },
    image: { type: String },
    image2: { type: String }
  },
  {
    timestamps: true
  }
);

const Review = model("Review", reviewSchema);

export { Review };







// import { Schema } from "mongoose";
// import { model } from "mongoose";



// const review = new Schema({
//     product_name:{type:String,required:true},
//     star:{Number,required:true},
//     title:{type:String,required:true},
//     about:{type:String,required:true},
//     image:{type:String},
//     image2:{type:String}
// },
// {
//     timestamps:true
// })
// const Review=model('Review',review)

// export {Review}