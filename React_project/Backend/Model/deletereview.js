import mongoose, { Schema, model } from "mongoose";

const DeletedReviewSchema = new Schema({
    reviewId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ✅ Add product reference
    title: String,
    reason: String,
    star: Number,
    about: String,
    images: [String], 
    deletedAt: { type: Date, default: Date.now },
  });
  
const DeletedReview = model("DeletedReview", DeletedReviewSchema);
export { DeletedReview };
