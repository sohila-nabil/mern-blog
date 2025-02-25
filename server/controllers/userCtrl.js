import User from "../models/userModel.js";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const image = req.files;
  try {
    if (req.user.id !== id) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    if (name) user.username = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (image) {
      if (user.profilePicture.public_id && user.profilePicture.public_id !== "")
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
      const { tempFilePath } = image.image;
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "blog",
      });
      if (!result || result.error) {
        console.log(result.error);
        return next(errorHandler(500, "Image upload failed"));
      }
      user.profilePicture = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    await user.save();
    const { password: userPassword, ...data } = user._doc;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    if (user.profilePicture.public_id && user.profilePicture.public_id !== "")
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export { updateUser, deleteUser, getUsers, getUser };
