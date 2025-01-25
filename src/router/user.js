const express=require('express')
const userRouter=express.Router();
const userAuth=require('../middleware/auth');
const requestModel = require('../models/requestModel');
const User=require('../models/user')
const { set } = require('mongoose');

const USER_SAVE_DATA = [
  "firstName",
  "LastName",
  "age",
  "gender",
  "profile",
  "about",
  "skill",
];

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
   try{
         const logedInuser=req.user._id;

          const findConnection=await requestModel.find({
          
          toUserId:logedInuser,
          status:"interested",
         }).populate('fromUserId',['firstName','LastName','age','gender','about','profile','skills'])

         if(!findConnection){
           res.status(400).json({message:"Invalid Request"})
         }
         res.status(200).json({
          message:"Data Fetched successfully",
          findConnection
         })
   }
   catch(err){
      console.log("Error inside the user request get api ",err);
      res.status(404).json({message:"Bad Request"})
   }
})

userRouter.get('/user/connection',userAuth,async(req,res)=>{
  try{
     const logedInuser=req.user._id;

     const findAllconnection=await requestModel.find({
      $or:[
        {toUserId:logedInuser,status:"accepted"},
        {fromUserId:logedInuser,status:"accepted"}
      ]    
     }).populate("fromUserId",USER_SAVE_DATA).populate("toUserId",USER_SAVE_DATA)


     const data=findAllconnection.map((key)=>{
       if(key.fromUserId._id.toString()=== logedInuser.toString()){
         return key.toUserId
       }
       return key.fromUserId    
     })

     res.status(200).json({message:
      "Fetched the connection request successfully",
       data
     })




  }catch(err){
     console.log("Error inside user connection ",err);
     res.status(400).json({message:"Invalid credentials"})
  }
})

userRouter.get('/user/feed',userAuth,async(req,res)=>{
  try{
    
    const logedInuser=req.user._id;
 
    const page=parseInt(req.query.page)|| 1
    let limit=parseInt(req.query.limit) ||10;
    limit=limit>50? 50:limit;
    const skip=(page-1)*limit;


    const AllConnection=await requestModel.find
    ({
      $or:[{fromUserId:logedInuser},{toUserId:logedInuser}]
    }).select("fromUserId toUserId")

    const hideUserFeed=new Set();
    
      AllConnection.forEach((req)=>{
        hideUserFeed.add(req.fromUserId.toString()),
        hideUserFeed.add(req.toUserId.toString())
      })

      const user=await User.find({
          $and:[{_id:{$nin:Array.from(hideUserFeed)}},{_id:{$ne:logedInuser}}] 
      }).select(USER_SAVE_DATA).skip(skip).limit(limit).populate('profile');

    res.status(200).json({
      message:"User Feed Information of the user",
      user
    })

  }catch(err){
    console.log("Error inside the user feed",err);
    res.status(404).json({message:"Bad Request"})
  }
})

module.exports=userRouter;
