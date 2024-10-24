const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");

const authrouter=require('../src/router/auth')
const ProfileRouter=require('../src/router/profile');
const requestRouter = require("./router/request");

app.use(express.json());
app.use(cookieParser());

app.use("/",authrouter);
app.use("/",ProfileRouter);
app.use("/",requestRouter);

const PORT=7777;
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
