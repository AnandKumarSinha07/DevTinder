const express=require('express')
const requestRouter=express.Router();
const userAuth=require('../middleware/auth');
const User = require('../models/user');
const requestModel = require('../models/requestModel');


requestRouter.post('/request/send/:status/:touserId',userAuth,async(req,res)=>{
    try{
        
       
       const fromUserId=req.user._id;
       
       const findSender=await User.findById(fromUserId);

       
      
       const toUserId=req.params.touserId;
    
       const status=req.params.status;

       const StatusOption=['interested','ignored'];

       if(!StatusOption.includes(status)){
         return res.status(400).json({message:"Invalid status request"})
       }

       const findToUser=await User.findById(toUserId);

       if(!findToUser){
         return res.status(401).json({message:"Invalid Request "})
       }

       const findInDb=await requestModel.findOne({
          $or:
          [
           {fromUserId:toUserId,toUserId:fromUserId},
           {fromUserId,toUserId}
          ]     
       })


        if(findInDb){
            return res.status(401).json({message:"Request Already Existed Between User"})
        }


       const newConnection=await requestModel({
          fromUserId,toUserId,status
       })

       const data=await newConnection.save();
       
       return res.status(200).json({
        data,
        message:`${findSender.firstName} is ${status}  in Your Profile`
       })


    }catch(err){
        console.log("Error inside the send request api",err);
        return res.status(401).json({message:"Error in the Api"})
        
    }
})

requestRouter.post('/request/review/:status/:userId',userAuth,async(req,res)=>{ 
    try{
          
          
          const status=req.params.status;  
          const logedInuser=req.user._id;
          const findLogedInuser=await User.findById(logedInuser)
          const fromUserId=req.params.userId;

          const StatusOption=['accepted','rejected'];

          if(!StatusOption.includes(status)) {
              return res.status(400).json({message:"Bad Status Request"})
          }


          const newConnection=await requestModel.findOne({
            _id:fromUserId,
            toUserId:logedInuser,
            status:"interested"
          })

          if(!newConnection){
            return res.status(401).json({message:"Invalid request type"})
          }
          
          newConnection.status=status;

          const data=await newConnection.save();

          return res.status(200).json({
            data,
            message:`${findLogedInuser.firstName} ${newConnection.status} Your Request `,
          })

    }catch(err){
        console.log("Error inside the reuest review api",err)
        return res.status(500).json({message:"Error in the request review api "})
    }
})

module.exports=requestRouter;