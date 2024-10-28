const validator = require("validator");

const validationFunction = async (req, res) => {
  const { firstName, LastName, email, password } = req.body;

  if (!firstName || !LastName || !email || !password) {
    return res.json({ message: "Fill The Reauired Field" });
  }

  const EmailCheck = validator.isEmail(email);
  if (!EmailCheck) {
    return res.json({ message: "Invalid Email Format" });
  }
  const firstNameCheck = validator.isAlpha(firstName);
  if (!firstNameCheck) {
    return res.json({ message: "Enter String*" });
  }
  const LastNameCheck = validator.isAlpha(LastName);
  if (!LastNameCheck) {
    return res.json({ message: "Enter String*" });
  }
  const passwordCheck = validator.isStrongPassword(password);
  if (!passwordCheck) {
    res.send("weak password");
  }
};

const profileEditValidation = (req) => {
  const AllowedField = [
    "firstName",
    "lastName", 
    "age",
    "about",
    "profile",
    "skill",
    "gender",
    "email",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    AllowedField.includes(field)
  );

  return isAllowed;
};
  

module.exports = { profileEditValidation, validationFunction };
