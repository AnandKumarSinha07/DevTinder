const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authrouter = express.Router();
const { validationFunction } = require("../middleware/validation");

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const findEmail = await User.findOne({ email: email });

    if (!findEmail) {
      return res.status(401).send("Invalid Credentials");
    }

    const PasswordCompare = await bcrypt.compare(password, findEmail.password);
    const userId = findEmail._id;

    if (!PasswordCompare) {
      return res.status(401).send("Invalid Credentials Password is wrong");
    } else {
      const token = await jwt.sign({ _id: userId }, "anand123@", {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
           httpOnly: true,
           secure: true,
           sameSite: "None",
       });
    }
    res.status(200).send(findEmail);
  } catch (err) {
    console.log("Error inside Login Api", err);
    res.status(404).send("Not Authorized Please Enter yout details Properly");
  }
});

authrouter.post("/signup", async (req, res) => {
  try {
    validationFunction(req);

    const { firstName, LastName, email, password } = req.body;

    const passWordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      LastName,
      email,
      password: passWordHash,
    });
    const saveduser = await user.save();
    const { _id } = saveduser;
    console.log("saved user id is ", _id);

    const token = await jwt.sign(
      { _id: saveduser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      });

    res.status(200).json({
      message: "User Added Successfully ",
      data: saveduser,
    });
  } catch (err) {
    console.log("Error in the signup api ", err);
    res.status(404).send("Not found ");
  }
});

authrouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
    httpOnly:true,
    secure:true,
    sameSite:"none",
  });
  return res.status(200).send("Logout successful");
});

module.exports = authrouter;
