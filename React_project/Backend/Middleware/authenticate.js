import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        const cookie = req.headers.cookie;
        if (!cookie) {
            return res.status(401).json({ message: "Login required" });
        }

        const [name, token] = cookie.trim().split("=");
        if (name !== 'cookietoken' || !token) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }

        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Verified User:", verified);

        // Ensure your JWT contains user ID
        req.user = { id: verified.id, email: verified.email };
        console.log( req.user)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};

export { authenticate };







// import jwt from 'jsonwebtoken'

// const authenticate=(req,res,next)=>{
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
//         if(name=='cookietoken'){
//             const verified=jwt.verify(token,process.env.SECRET_KEY)
//             console.log(verified);
//             req.email=verified.EMAIL
//             req.password=verified.PASSWORD;
//             next();
//         }
        
        
//     }
// }

// export {authenticate}