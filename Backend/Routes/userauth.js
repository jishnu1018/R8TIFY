import { Router } from "express";
import { SIGNUP } from "../Model/sample.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";





const user = Router();

//signup
user.post('/signup', async (req, res) => {
    try {
        const { EMAIL, PASSWORD, CONFIRM,ROLE } = req.body;
    

        const existingUser = await SIGNUP.findOne({ email:EMAIL });    
        if (existingUser) {
             res.status(400).json({ message: "Email already exists" });
             console.log("Email already exists");
             
        }
        else{

            if (PASSWORD !== CONFIRM) {
                console.log("Passwords do not match");
                res.status(400).json({ message: "Passwords do not match" });
            }
            else{
    
            const newpassword =await bcrypt.hash(PASSWORD,10);
                console.log(newpassword);
                const newuser=new SIGNUP({
                    email:EMAIL,
                    password:newpassword,
                    role:ROLE
                })
                await newuser.save()
                console.log(newuser);
                console.log("Signup successfull");
    
            res.status(201).json({ message: "Signup successfull", user: newuser });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//login
user.post('/login',async (req,res)=>{
    try{
        const {EMAIL,PASSWORD} = req.body;
        
        const result = await SIGNUP.findOne({email:EMAIL})
        console.log(result);
        
        if(!result){
            console.log("Enter a valid username");
            res.status(400).send("Enter a valid username");
        }
        else{
            console.log(result.password);
            const valid=await bcrypt.compare(PASSWORD,result.password)
            console.log(valid);
            if(valid){
                const token= jwt.sign({email:EMAIL,role:result.role},process.env.SECRET_KEY)
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
        res.status(500).send("Internal Server Error")
    }
})

export { user };









// import { Router } from "express";
// import dotenv from "dotenv";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';


// dotenv.config()
// const userauth=Router();

// const user=new Map() 


// userauth.post('/signup', async(req,res)=>{
//     try{
//         const {EMAIL,PASSWORD,CONFIRM}=req.body

//         if(user.get(EMAIL)){
//             console.log("EMAIL already registerd");
//             res.status(400).send("EMAIL already registerd")

            
//         }
//         else{
//             if(PASSWORD===CONFIRM){
//                 const newpassword= await bcrypt.hash(PASSWORD,10)
//                 user.set(EMAIL,{EMAIL,newpassword})
//                 console.log(user.get(EMAIL));
//                 console.log("signed in");
//                 res.status(200).send(user.get(EMAIL));
//             }
//             else{
//                 res.status(200).send("Enter Same Password");
//                 console.log("Enter Same Password");
//             }
//         }
//     }
//     catch{
//         res.status(500).send("internal server Error")

//     }
// });

// userauth.post('/login', async(req,res)=>{
//     try{
//         const {EMAIL,PASSWORD}=req.body
//         const result=user.get(EMAIL)
//         console.log(result);

//         if(!result){
//             res.status(500).send("Enter a valid email or password");
//             console.log("Enter a valid email or password");
//         }
//         else{
//             console.log(result.newpassword);
//             const valid =await bcrypt.compare(PASSWORD,result.newpassword)
//             console.log(valid);
//             if(valid){
//                 const token=jwt.sign({Email:EMAIL},process.env.SECRET_KEY);
//                 console.log(token);
//                 res.cookie('Cookie',token,{
//                     httpOnly:true
//                 })
//                 console.log("Logged in successfully");
//                 res.status(200).json({message:"Logged in successfully"});

//             }
//             else{
//                 res.status(401).send("Unauthorized access");
//             }
            
//         }
//     }
//     catch{
//         res.status(500).send("Internal Server Error")

//     }
// })
// export {userauth}