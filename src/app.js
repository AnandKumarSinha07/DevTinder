const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors=require('cors')

require('dotenv').config()

const authrouter=require('../src/router/auth')
const ProfileRouter=require('../src/router/profile');
const userRouter = require("./router/user");
const requestRouter=require('../src/router/request')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true  
}))

app.use("/",authrouter);
app.use("/",ProfileRouter);
app.use("/",userRouter);
app.use('/',requestRouter)



const PORT=process.env.PORT;
dbConnect()
  .then(() => {
    console.log("conedcted to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
  })
  .catch((error) => {
    console.log("error in the code", error);
  });
