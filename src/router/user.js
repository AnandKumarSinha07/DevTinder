const express=require('express');
const { useTransform } = require('framer-motion');
const userAuth = require('../middleware/auth');

const requestModel=require('../models/requestModel')
const userRouter=express.Router();


userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
         const logedInuser=req.user;

         const requestReceived=await requestModel.find({
            toUserId:logedInuser._id,
            status:"interested",
         }).populate("fromUserId",["firstName","LastName","age","gender"," profile","about","skill"])

         res.status(200).json({
           message:"Data fetched successfully",
           requestReceived
         })
    }catch(err){
        console.log("Error inside the request received api ",err);
        res.status(400).send("Bad Request")
    }
})




module.exports=userRouter;