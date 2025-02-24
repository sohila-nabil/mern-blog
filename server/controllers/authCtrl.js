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

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return next(errorHandler(400, "all fields are required"));
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "invalid credentials"));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(errorHandler(400, "invalid credentials"));
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: userPassword, ...data } = user._doc;
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "user logged in successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const signWithGoogle = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin:user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...data } = user._doc;
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, message: "logged in successfully", data });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const randomName =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: randomName,
        email,
        password: hashedPassword,
        profilePicture: {
          public_id: "",
          url: photo,
        },
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...data } = newUser._doc;
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, message: "registered  successfully", data });
    }
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export { signup, signin, signWithGoogle, signout };
