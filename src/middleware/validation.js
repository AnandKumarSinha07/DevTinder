const validator = require("validator");



const validationFunction = async (req,res) => {
  
    const { firstName, LastName, email, password } = req.body;
  
    const errors=[]; 
    if (!firstName || !LastName || !email || !password) {
        throw new Error("All fields are required");
    }
  
    const EmailCheck = validator.isEmail(email);
    if (!EmailCheck) {
       throw new Error("Invalid Email")
       //return res.status(400).send("Invalid email format");
    }
    const firstNameCheck = validator.isAlpha(firstName);
    if (!firstNameCheck) {
        throw new Error("First name must contain letters only");
    }
    const LastNameCheck = validator.isAlpha(LastName);
    if (!LastNameCheck) {
       throw new Error("Last name must contain letters only");
    }
    const passwordCheck = validator.isStrongPassword(password);
    if (!passwordCheck) {
      throw new Error("Weak password");
    }
  };
  
  module.exports = validationFunction;