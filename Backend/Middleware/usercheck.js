const usercheck=(req,res,next)=>{
    console.log(req.role);
    
    if(req.role=='User'){
        next();
    }
    else{
        res.status(403).json({msg:"You are not allowed"})
    }
}

export {usercheck};