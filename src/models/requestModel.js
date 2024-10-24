const { response } = require('express');
const mongoose=require('mongoose')


const requestSchema=new mongoose.Schema
(
    {
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","accepted","interested","rejected"],
            message:`{VALUE} is incoorect status types`
        },
     },
   },
   {timestamps: true }
)


requestSchema.pre("save",function(next){
    if(this.fromUserId.equals(this.toUserId)){
        return res.status(404).json({
            message:"You cannot send request to yourself"
        })
    }
    next();
})

requestSchema.index({fromUserId:1,toUserId:1})
const requestModel= new mongoose.model("RequestModel",requestSchema);

module.exports=requestModel;