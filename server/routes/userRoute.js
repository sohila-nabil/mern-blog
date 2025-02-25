import verifyUser from "../utils/verifyUser.js";
import { Router } from "express";
import {
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} from "../controllers/userCtrl.js";
const userRouter = Router();

userRouter.get("/get-users", verifyUser, getUsers);
userRouter.get("/get-user/:userId", getUser);
userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);

export default userRouter;
