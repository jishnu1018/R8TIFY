import jwt from 'jsonwebtoken'

const adminauthen = (req, res, next) => {
    const token = req.cookies.cookietoken; // ✅ This correctly extracts the token
    console.log("Token received:", token); // Debugging

    if (!token) {
        console.log("Login to access - No cookie found");
        return res.status(400).send("Login to access");
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log("JWT Verified:", verified);
        req.email = verified.email;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
};



// const adminauthen = (req, res, next) => {
//     const cookie = req.headers.cookie;
//     console.log("Cookies received:", cookie);  // Debugging

//     if (!cookie) {
//         console.log("Login to access - No cookie found");
//         return res.status(400).send("Login to access");
//     }

//     const [name, token] = cookie.trim().split("=");
//     console.log("Extracted cookie name:", name);  // Debugging
//     console.log("Extracted token:", token);  // Debugging

//     if (name === 'cookietoken') {
//         try {
//             const verified = jwt.verify(token, process.env.SECRET_KEY);
//             console.log("JWT Verified:", verified);  // Debugging
//             req.email = verified.email;
//             console.log("User Email Set in req:", req.email);  // Debugging
//             next();
//         } catch (error) {
//             console.error("JWT Verification Error:", error.message);
//             return res.status(403).json({ msg: "Invalid or expired token" });
//         }
//     } else {
//         console.log("Invalid cookie name:", name);
//         return res.status(403).json({ msg: "Invalid token" });
//     }
// };

export { adminauthen };































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