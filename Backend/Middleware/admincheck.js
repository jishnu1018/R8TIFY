const adminCheck=(req,res,next)=>{
    if(req.role=='Admin'){
        next();
    }
    else{
        res.status(403).json({msg:"You are not allowed"})
    }
}

export {adminCheck};