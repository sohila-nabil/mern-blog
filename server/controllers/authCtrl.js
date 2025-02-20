import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    if (
      !username ||
      !password ||
      !email ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(400, "all fields are required"));
    }
    const user = await User.findOne({ username });
    if (user)
      return next(errorHandler(400, "user with this username already exist"));
    const emailExist = await User.findOne({ email });
    if (emailExist)
      return next(errorHandler(400, "user with this email already exist"));
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "user registered successfully" });
  } catch (error) {
    next(error);
  }
};

export { signup };
