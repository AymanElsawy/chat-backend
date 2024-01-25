import User from "../model/user.model.js";
import joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
export async function login(req, res) {
  const { username, password } = req.body; // extract username and password from req.body
  if (!username || !password) {
    // check if username and password are provided
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username and password are required" });
  }
  const user = await User.findOne({ username }); // check if user exists
  if (user) {
    return bcrypt.compare(password, user.password).then((isMatch) => {
      // compare password
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          // create JWT token
          expiresIn: "1h",
        });
        return res // return success response
          .status(StatusCodes.OK)
          .json({ message: "Login successful", token });
      }
      return res // return error response if password is incorrect
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    });
  }
  return res // return error response if user does not exist
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: "Invalid username" });
}

export async function signup(req, res) {
  const { username } = req.body; // extract username from req.body
  const user = await User.findOne({ username }); // check if user already exists
  if (user) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "User already exists" }); // return error if user already exists
  }
  const userSchema = joi.object({
    // create Joi schema for user validation
    username: joi.string().required().min(3).max(20).messages({
      "string.base": "Username must be a string",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 20 characters long",
      "any.required": "Username is required",
    }),
    password: joi.string().required().min(6).messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    repeat_password: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "string.empty": "Repeat password is required",
        "any.required": "Repeat password is required",
        "any.only": "Passwords do not match",
      }),
  });

  const { value, error } = userSchema.validate(req.body); // validate user data
  if (error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message }); // return error if validation fails
  return bcrypt.hash(value.password, 10).then((hash) => {
    // hash password
    const newUser = new User({
      // create new user
      username: value.username,
      password: hash,
    });
    User.create(newUser) // save user to database
      .then((user) => {
        const token = jwt.sign(
          // generate JWT token
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res // return success response
          .status(200)
          .json({ message: "User created successfully", token: token });
      })
      .catch((err) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          // return error response
          message: err,
        });
      });
  });
}

export function getUser(req, res) {
  const id = req.params.id;
  User.findById(id)
  .populate({
    path: "conversations",
    populate: {
      path: "messageId",
      model: "Conversation",
    },
  })
  .select("-password")
 
  .then((user) => {
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res.status(StatusCodes.OK).json(user);
  })
  .catch((err) => {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err });
  })
}

export function getAllUsers(req,res){
  User.find()
  .select("-password")
  .then((users) => {
    if (!users) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Users not found" });
    }
    return res.status(StatusCodes.OK).json(users);
  })
  .catch((err) => {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err });
  })
}
