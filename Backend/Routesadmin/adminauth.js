import  {Router}  from "express";
import bcrypt from 'bcrypt'
import { Adminsign } from "../Model/Admin/signup.js";
import jwt from "jsonwebtoken"


const admin=Router();

//signup
admin.post('/adminsignup',async(req,res)=>{
    try{
        
        const {Email,Password,Role}=req.body;
        const newpassword=await bcrypt.hash(Password,10)
        console.log( newpassword);
        const aadmin=new Adminsign({
            email:Email,
            password:newpassword,
            role:Role
            
        })
        await aadmin.save();
        console.log(aadmin);
        console.log("Signup successfull");
        
        res.status(201).json({ message: "Signup successfull" });

        
    }   
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


//login
admin.post('/adminlogin',async(req,res)=>{
    try{

        const {Email,Password}=req.body
        const result = await Adminsign.findOne({email:Email})

        if(!result){
            console.log("Enter a valid username");
            res.status(400).send("Enter a valid username");
        }
        else{
            console.log(result.password);
            const valid=await bcrypt.compare(Password,result.password)
            console.log(valid);
            if(valid){
                const token= jwt.sign({email:Email,role:result.role},process.env.SECRET_KEY)
                console.log(token);
                res.cookie('cookietoken',token,{
                    httpOnly:true
                })
                console.log("Logged in successfully");
                
                res.status(200).json({message:"Logged in successfully"});
            }
            else{
                
                res.status(401).send("Unauthorized access");

            }
            
        }
        
    }
    catch{

    }
})

export {admin}