

const express=require('express');

const app=express();

let data={
    name:"Anand",
    email:"anandkr7808@gmail.com"
}

app.post("/data",(req,res)=>{
    res.status(200).json({
        data
    })
    console.log("data savrd ")
    
})

app.patch("/data",(req,res)=>{
    console.log("Inside path");
    res.send("inside the patch")
    
})
app.get("/profile",(req,res)=>{
    res.send(data)
    console.log("data received successulyy")
})
app.use("/hello",(req,res)=>{
    res.send("Hello world") 
});

app.use("/test",(req,res)=>{
    res.send("Testing of the  ect")
});


app.use("/system",(req,res)=>{
    res.send("system check")
})



app.use("/",(req,res)=>{
    res.send("Inside the default route")
})



const PORT=7777;

app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
  
});


