import { Schema, model,Types } from "mongoose";

const productt = new Schema(

  {
    Product_name:{ type: String, required: true },
    Product_description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Phones", "Laptops", "Consoles", "Cameras"] // Restricts allowed categories
    },
    image: { type: String }, // First image URL
    image2: { type: String }, // Second image URL
    reviews: [{ type: Types.ObjectId, ref: "Review" }] // Add this field to reference reviews

  },
  {
    timestamps: true,
  }
);


const PROduct = model("Product", productt);

export { PROduct };







//   {
//     Product_name: { type: String, required: true },
//     Product_description: { type: String, required: true },
//     price: { type: Number, required: true }, // Changed from String to Number
//     image: { type: String }, // Optional Image URL
//     image2: { type: String }, // Optional Second Image URL
//   },
//   {
//     timestamps: true,
//   }
// );