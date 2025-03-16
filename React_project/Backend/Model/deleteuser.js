import { Schema, model } from "mongoose";

const DeletedUserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    deletedAt: { type: Date, default: Date.now } // Store deletion time
});

const DeletedUser = model("DeletedUser", DeletedUserSchema);

export { DeletedUser };
