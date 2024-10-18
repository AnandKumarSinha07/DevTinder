const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");
const SignUpVallidation = require("../src/utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../src/middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await User.findOne({ email: email });
    if (!checkEmail) {
      throw new Error("Invalid Credentials");
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    const userId = checkEmail._id;

    if (checkPassword) {

      const token =  jwt.sign({ _id: userId }, "DEV@Tinder$790",{expiresIn:"1d"});
      res.cookie("token",token);
      res.send("Login successfull");

    } else {
      throw new Error("Invalid Credentials ")    
    }

  } catch (err) {
    console.log("Error inside the login API " + err);
    res.status(404).send("Internal Error");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(404).send("Invalid");
  }
});

app.post("/signup", async (req, res) => {
  try {
    SignUpVallidation(req);

    const { password, email, firstName, LastName } = req.body;
    console.log(password, email, firstName, LastName);

    const hasPassword = await bcrypt.hash(password, 10);
    console.log(hasPassword);

    const user = new User({
      firstName,
      LastName,
      email,
      password: hasPassword,
    });

    await user.save();
    res.send("data save successfully ");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});















dbConnect()
  .then(() => {
    console.log("conedcted to the database");

    app.listen(7777, () => {
      console.log(`Server is running on port `);
    });
  })
  .catch((error) => {
    console.log("error in the code", error);
  });
