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

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        // fromuserId=anand
        // loged in user =saurabh
        // status always be interested 
        // this we have to find in the requestModel so on the basis of that we are going to accept it

        const senderId=req.params.requestId;
        const logedinUser=req.user;
        const status=req.params.status;
        
        const validStatus=["accepted","rejected"];
        if(!validStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type"})
        }

        const reviewStatusInDb=await requestModel.findOne({
            status:"interested",
            fromUserId:senderId,
            toUserId:logedinUser._id,
        })
        if(!reviewStatusInDb){
            return res.status(404).json({message:"Invalid Request From User"})
        }


        const data=await reviewStatusInDb.save();
        reviewStatusInDb.status=status;

        return res.status(200).json({
            message:logedinUser.firstName+status+" your request" ,
            data
        })
        

    }catch(err){
        console.log("Error in the request review api ",err);
        res.status(404).send("Bad request");
        
    }
})



module.exports=requestRouter;