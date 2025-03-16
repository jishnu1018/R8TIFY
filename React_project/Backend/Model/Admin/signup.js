import { Schema } from "mongoose";
import { model } from "mongoose";

const adminsignup = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Adminsign = model('AdminSignup', adminsignup);

export { Adminsign };
