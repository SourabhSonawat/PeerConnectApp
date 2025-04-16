const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong password");
  }
};

const validateEditProfileUpData = (req) => {
  const allowedEditField = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
    "emailId",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditField.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileUpData };
