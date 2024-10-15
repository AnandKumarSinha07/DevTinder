const express = require('express');
const dbConnect=require('./config/database'); 
const app = express();
const User=require("./models/user");



app.use(express.json());


app.post("/login", async (req, res) => {

    const user=new User(req.body);

    try {
       await user.save();
       res.send("data save successfully ");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Get the user data through email
app.get("/getUser",async(req,res)=>{
    
    const emailUser=req.body.email;
    console.log(emailUser)

     const findWithEmail=await User.find({email:emailUser});
     if(findWithEmail.length===0){
        console.log("Not found")
        return res.status(404).send("not found");
     }
    try{
       await res.status(200).send("ok");
    }
    catch(error){
       console.log("Error in the get Email code");
       res.status(404).send("Not able to send data"); 
    }
})

//Feed Api To get All Data
app.get("/feed",async(req,res)=>{

    const UserData=req.body;
    try{
        const data= await User.find(UserData);
        res.status(200).send(data)

    }
    catch(error){
        console.log("Error in the feed api");
        res.send(404).send("feed not found")
        
    }
})

//Feed Api To get All Data By ID

app.get("/getId",async(req,res)=>{
    const UserId=await req.body._id;
    console.log(UserId) 
    try{
      const data=await User.findById(UserId);
      res.status(200).send(data);
    }catch(error){
         console.log("Error in the find id api ");
         res.status(404).send("Id not found")
    }
})

//Delete a particular record

app.delete("/deleteUser",async(req,res)=>{
    const userId=await req.body._id;
    console.log("userid",userId);
    try{
      const deleteUser=await User.findByIdAndDelete(userId);
      res.status(200).send(deleteUser);
    }catch(error){
       console.log("error in the delete api")
       res.status(400).send("Eroor Not found")
    }
})

// Update a particular Record;

app.patch("/userUpdate",async(req,res)=>{
    const userId=await req.body._id;
    const data=await req.body;

    try {
        const UpdateData=await User.findByIdAndUpdate(userId,data);
        res.status(200).send("data updated successfully");
    } catch (error) {
        console.log("Error inside the update api");
        res.send(400).send("unauthrized");    
    }
})

dbConnect()
.then(()=>{
    console.log("conedcted to the database");
    app.listen( 7777, () => {
        console.log(`Server is running on port `);
    });
    
}).catch((error)=>{
    console.log("error in the code");   
})




