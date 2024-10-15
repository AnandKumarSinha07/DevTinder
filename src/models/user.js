const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:30,
        lowercase:true,
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
        required:true,
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
        default:Date.now(),

    },
    about:{
        type:String,
        default:"This is about my bio profile",
        trim:true,
    },


    profile:{
        type:String,
        default:"https://i.pinimg.com/736x/59/37/5f/59375f2046d3b594d59039e8ffbf485a.jpg",
        required:false,
        trim:true,
    },
    skill:{
        type:[String],
       
    }


},{
    timestamps:true,
})

const User=mongoose.model("User",userSchema);
module.exports=User;
