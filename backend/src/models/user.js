const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 40,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 40,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invaild email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong password" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // validate function only work when new document created but we gave access to routes checks once
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid" + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th?id=OIP.w0TcjC4y9CxTrY3sitYa_AAAAA&pid=Api&P=0&h=220",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about the user! ",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// always use normal function not arrow function beacuse this keyword only work with normal function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
