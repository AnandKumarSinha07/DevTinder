const adminAuth=(req,res,next)=>{
    const token="xyz";
    const verified_token="xez";

    if(token===verified_token){
        next();
    }
    else{
        res.send("u are not authorized to visit the page");
    }
}

const userAuth=(req,res,next)=>{
    const userToke="anc";
    const checkToken="afnc";

    if(userToke==checkToken){
        next();
    }
    else{
        res.send("simply not authorized to get the data");
    }
}

module.exports={
    adminAuth,
    userAuth
}