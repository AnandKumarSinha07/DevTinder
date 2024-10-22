const validator = require("validator");



const validationFunction = async (req,res) => {
  
    const { firstName, LastName, email, password } = req.body;
  
    if (!firstName || !LastName || !email || !password) {
        throw new Error("All fields are required");
    }
  
    const EmailCheck = validator.isEmail(email);
    if (!EmailCheck) {
        throw new Error("Email Format is Not valid");
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