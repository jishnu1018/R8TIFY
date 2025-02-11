import { Router } from "express";
import { adminauthen } from "../Middleware/adminauthen.js";
import { PROduct } from "../Model/Admin/add.js";
import { SIGNUP } from "../Model/sample.js";
import { Review } from "../Model/sample1.js";
import { adminCheck } from "../Middleware/admincheck.js";
//import { authenticate } from "../Middleware/authenticate.js";
import { upload } from "../Middleware/Multer.js";


const adminadd=Router();
const ConvertToBase64=(buffer)=>{
    return buffer.toString("base64");
}

//Add a product
adminadd.post('/productadd',adminauthen,adminCheck,upload.fields
    ([{name:"productimage1",maxCount:1},
        {name:"productimage2",maxCount:1}]),
    async(req,res)=>{
    try{
        const {Product,Description,Price}=req.body
        console.log(Product);
        
        
        const sameproduct= await PROduct.findOne({ Product_name:Product}) 
        if(sameproduct){
        res.status(400).send("Product already there bro")
        console.log("already there bro")
        }
        else{
            let proimage1=null;
            let proimage2=null;
            if(req.files && req.files["productimage1"]){
                proimage1=ConvertToBase64(req.files["productimage1"][0].buffer)
            }
            if(req.files && req.files["productimage2"]){
                proimage2=ConvertToBase64(req.files["productimage2"][0].buffer)
            }
            const pro=new PROduct({
            Product_name:Product,
            Product_description:Description,
            price:Price,
            image:proimage1,
            image2:proimage2
        })  
        await pro.save();
        console.log(pro);
        res.status(200).send("Product added");
        console.log("Product added");
    } 
    }
    catch{
        res.status(404).send("error")
         console.log("error");
    }
})

//Update the Product
adminadd.put('/productupdate',adminauthen,adminCheck,async(req,res)=>{
    try{
        const {Product,Description,Price}=req.body
        const oneproduct= await PROduct.findOne({ Product_name:Product}) 
        if(oneproduct){
            
            oneproduct.Product_description=Description,
            oneproduct.price=Price
            console.log(oneproduct);
            await oneproduct.save()
            res.status(200).send("updated ")
    
    }
    else{
        res.status(400).send("add coursename")
    console.log("add coursename")
    }

   }
      catch{
        console.log("error")
    }
})

//Get the product
adminadd.get('/getproduct',adminauthen,adminCheck,async(req,res)=>{
    const product=req.query.name
    const prod= await PROduct.findOne({Product_name:product})
    if(prod){
        res.status(200).send(prod)
        console.log(prod);
    }
    else{
        res.status(404).send("error")
        console.log("error");
    }
})


//Delete the Product
adminadd.delete('/productdelete',adminauthen,adminCheck,async(req,res)=>{
    try{
        const productname=req.query.pname
        console.log(productname);
        const pName=await PROduct.findOneAndDelete({Product_name:productname})
        if (pName){
            res.status(200).send(pName)
            console.log(pName);
            console.log("deleted");
        }
        else{
            res.status(400).send("add name")
        }
    }
    catch{
        res.status(500).send("Error")

    }
})

//Get the User
adminadd.get('/userget',adminauthen,adminCheck,async(req,res)=>{
    const Name=req.query.email
    const userr= await SIGNUP.findOne({email:Name})
    if(userr){
        res.status(200).send(userr)
        console.log(userr);
    }
    else{
        res.status(404).send("error")
        console.log("error");
    }
})


//Delete the User
adminadd.delete('/userdelete',adminauthen,adminCheck,async(req,res)=>{
    try{
        
        
        const uusername=req.query.uname
        console.log(uusername);
        
        
        const uName=await SIGNUP.findOneAndDelete({email:uusername})
        if (uName){
            res.status(200).send(uName)
            console.log(uName);
            console.log("deleted");
        }
        else{
            res.status(400).send("add name")
        }
    }
    catch{
        res.status(400).send("Error")

    }
})

//Delete the Review
adminadd.delete('/reviewdelete',adminauthen,adminCheck,async(req,res)=>{
    try{
        console.log("buni");
        
        const review=req.query.rname
        console.log(review);
        
        const RName=await Review.findOneAndDelete({name:review})
        if (RName){
            res.status(200).send(RName)
            console.log(RName);
            console.log("deleted");
        }
        else{
            res.status(400).send("add name")
        }
    }
    catch{
        res.status(500).send("Error")

    }
})

//logout
adminadd.get('/adminlogout',(req,res)=>{
    res.clearCookie('cookietoken');
    res.status(200).send("logout")
    console.log("logout");
    
})

export {adminadd}