const mongoose=require('mongoose')
const validator = require('validator');
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:30,
        trim:true,

    },
    LastName:{
        type:String,
        required:true,
        maxLength:40,
        trim:true,
        lowercase:true,
    },
    age:{
        type:Number,
        min:18,
        validate(value){
            if(value<18){
                throw new Error("Age must be above 18 to register")
            }
            
        }       
    },

    gender:{
        type:String,
        enum:["male","female","others"],
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
  
        validate(value){
           if(!validator.isEmail(value)){
             throw new Error("Invalid email address"+value)
           }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                 throw new Error("please enter some strong password")
            }
        }
    },
    about:{
        type:String,
        default:"This is xyz profile",
        trim:true,
        max:40,
        
    },


    profile:{
        type:String,
        default:"https://i.pinimg.com/736x/59/37/5f/59375f2046d3b594d59039e8ffbf485a.jpg",
        required:true,
        trim:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url")
            }
        }
    },
    skill:{
        type:[String],  
    }


},{
    timestamps:true,
})


const User=mongoose.model("User",userSchema);
module.exports=User;
