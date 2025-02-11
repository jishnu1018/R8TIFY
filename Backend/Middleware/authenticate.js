import jwt from 'jsonwebtoken'

const authenticate=(req,res,next)=>{
    const cookie=req.headers.cookie
    console.log(cookie);
    if(!cookie){
        res.status(400).send("Login to add a review")
        console.log("Login to add a review");
    }
    else{
        const [name,token]=cookie.trim().split("=");
        console.log(name);
        console.log(token);
        if(name=='cookietoken'){
            const verified=jwt.verify(token,process.env.SECRET_KEY)
            console.log(verified);
            req.email=verified.EMAIL
            req.role=verified.role,
            req.password=verified.PASSWORD;
            next();
        }
        
        
    }
}

export {authenticate}