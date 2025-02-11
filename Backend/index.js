import express,{json} from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose'
import { user } from "./Routes/userauth.js";
import { review } from "./Routes/review.js";
import { admin } from "./Routesadmin/adminauth.js";
import { adminadd } from "./Routesadmin/adminadd.js";

dotenv.config();
const app=express();

app.use(json())
app.use('/',user)
app.use('/',review)
app.use('/',admin)
app.use('/',adminadd)

app.listen(process.env.PORT, function(){
    console.log(`server is listening at ${process.env.PORT}`);
    
});
mongoose.connect('mongodb://localhost:27017/R8tify').then(()=>{
    console.log("Mongodb connected succesfully");})
    .catch((error)=>{
        console.error("Mongodb connection failed",error);})

