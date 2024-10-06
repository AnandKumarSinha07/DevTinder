const express=require('express');

const app=express();
app.use(express.json());

const {adminAuth,userAuth}=require("./middleware/auth")

app.use("/admin",adminAuth);


app.get("/admin/getData",(req,res)=>{
    res.send("Data sent successfully");
})

app.get("/admin/deleteData",(req,res)=>{
    res.send("data deleted successfully");
})

app.use("/user/data",userAuth,(req,res)=>{
    res.send("user data sent successfully")
})

app.use("/user/login",(req,res)=>{
    res.send("login successfull");
})


const PORT=7777;

app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
  
});


