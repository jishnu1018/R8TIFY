import jwt from 'jsonwebtoken'

const adminauthen=(req,res,next)=>{
    const cookie=req.headers.cookie
    console.log(cookie);
    if(!cookie){
        res.status(400).send("Login to access")
        console.log("Login to access");
    }
    else{
        const [name,token]=cookie.trim().split("=");
        console.log(name);
        console.log(token);
        if(name=='cookietoken'){
            const verified=jwt.verify(token,process.env.SECRET_KEY)
            console.log(verified);
            req.email=verified.email,
            req.role=verified.role;
            console.log(req.email);
            next();
        }
        
        
    }
}

export {adminauthen}






























// import jwt from 'jsonwebtoken'

// const adminauthen=(req,res,next)=>{
//     const cookie=req.headers.cookie
//     console.log(cookie);
//     if(!cookie){
//         res.status(400).send("Login to add a review")
//         console.log("Login to add a review");
//     }
//     else{
//         const [name,token]=cookie.trim().split("=");
//         console.log(name);
//         console.log(token);
//         if(name=='TokenCookiee'){
//             const verified=jwt.verify(token,process.env.SECRET_KEY1)
//             console.log(verified);
//             req.email=verified.Email
//             req.role=verified.Role;
//             next();
//         }
        
        
//     }
// }

// export {adminauthen}