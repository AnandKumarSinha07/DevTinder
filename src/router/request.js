const express=require('express')
const requestRouter=express.Router();
const requestModel=require('../models/requestModel');
const User=require('../models/user')
const userAuth = require('../middleware/auth');


requestRouter.post("/request/:status/:touserID",userAuth,async(req,res)=>{
    
   try{
    const toUserId=req.params.touserID;
    console.log("to user id is",toUserId);
   
    const findTouserId=await User.findById(toUserId);
    if(!findTouserId){
        return res.status(400).json({message:"User Not Found"});
    }

    
    const fromUserId=req.user._id;
    console.log("from user id is ",fromUserId);

   
    const status=req.params.status;
    const ValidateStatus=["ignored","interested"];

    if(!ValidateStatus.includes(status)){
        return res.status(400).json({message:"Invalid Request status"});
    }

    const checkConnectionIndb=await requestModel.findOne({
        $or:
        [
          { toUserId,fromUserId},
          {toUserId:fromUserId,fromUserId:toUserId}  
        ] 
    })

    if(checkConnectionIndb){
        return res.status(400).json({message:"Request already exists between these users"})
    }


    const requestUser=new requestModel
    ({
        toUserId,
        fromUserId,
        status,
    })
    const data=await requestUser.save();

    res.status(200).json({
        message:req.user.firstName+ " is " +status+" in Your Profile "+findTouserId.firstName,
        data,
    })
    
   } catch(err){
         console.log("Error inside the request Api",err);
         res.status(400).send("Bad Request");
   }

})




module.exports=requestRouter;