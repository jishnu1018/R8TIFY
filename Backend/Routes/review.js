import { Router } from "express";
import { authenticate } from "../Middleware/authenticate.js";
import { Review } from "../Model/sample1.js";
// import { user } from "./userauth.js";
import { PROduct } from "../Model/Admin/add.js";
import { PROFILE } from "../Model/profile.js";
import { usercheck } from "../Middleware/usercheck.js";
import { upload } from "../Middleware/Multer.js";


const review=Router();
const ConvertToBase64=(buffer)=>{
    return buffer.toString("base64");
}

//Adding a review
review.post('/review',authenticate,usercheck,upload.fields
    ([{name:"reviewimage1",maxCount:1},
        {name:"reviewimage2",maxCount:1}
    ]),
    async(req,res)=>{
    
    try{
        const {Name,Star,Title,About}=req.body
        console.log(Name);
        const samereview= await Review.findOne({name:Name}) 
        if(samereview){
        res.status(400).send("coursename already there bro")
        console.log("already there bro")
        }
        else{
            const sameproduct= await PROduct.findOne({ Product_name:Name}) 
            if(sameproduct){
            let imagebase64_1=null;
            let imagebase64_2=null;
        
            if(req.files && req.files["reviewimage1"]){
                imagebase64_1=ConvertToBase64(req.files["reviewimage1"][0].buffer)
            }
            if(req.files && req.files["reviewimage2"]){
                imagebase64_2=ConvertToBase64(req.files["reviewimage2"][0].buffer)
            }
            const REVIEW =new Review({
                name:Name,
                star:Star,
                title:Title,
                about:About,
                image:imagebase64_1,
                image2:imagebase64_2
            })
            await REVIEW.save();
            console.log(REVIEW);
            res.status(200).send("Review added");
            console.log("Review added");
        }
        else{
            console.log("Product not here");
            
        }
        }
    }
    catch{
        res.status(404).send("error")
                console.log("error");
    }
})


//Update the review
review.put('/reviewupdate',authenticate,usercheck,async(req,res)=>{
    try{
        const {Name,Star,Title,About}=req.body
        const sreview= await Review.findOne({name:Name}) 
        if(sreview){
            sreview.name=Name,
            sreview.star=Star,
            sreview.title=Title,
            sreview.about=About,
            console.log(sreview);
            await sreview.save()
            res.status(400).send("updated ")
    
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

//Get the Product
review.get('/product',usercheck,authenticate,async(req,res)=>{
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


//Add the Profile
review.post('/profile',authenticate,usercheck,upload.single("profilephoto"),async(req,res)=>{
    try{
        const {NAME,PHN,DESC}=req.body
        console.log(NAME);
        const samename= await PROFILE.findOne({name:NAME}) 
        if(samename){
        res.status(400).send("coursename already there bro")
        console.log("already there bro")
        }
        else{
            let photo=null;
            if(req.file){
                photo=ConvertToBase64(req.file.buffer)
            }
            const PROFile =new PROFILE({
                name:NAME,
                phn_no:PHN,
                description:DESC,
                image:photo
            })
            await PROFile.save();
            console.log(PROFile);
            res.status(200).send("Profile added");
            console.log("Profile added");
            
        }
    }
    catch{
        res.status(404).send("error")
                console.log("error");
    }
})

//Upadte profile
review.put('/profileupdate',authenticate,usercheck,async(req,res)=>{
    try{
        const {NAME,PHN,DESC}=req.body
        console.log(NAME);
        const sname= await PROFILE.findOne({name:NAME}) 
        if(sname){
                sname.name=NAME,
                sname.phn_no=PHN,
                sname.description=DESC

            await sname.save();
            console.log(sname);
            res.status(200).send("Profile updated");
            console.log("Profile updated");
    
    }
    else{
        res.status(400).send("add name")
    console.log("add name")
    }

   }
      catch{
        console.log("error")
    }
})


//logout
review.get('/logout',(req,res)=>{
    res.clearCookie('cookietoken');
    res.status(200).send("logout")
    console.log("logout");
    
})

export {review}