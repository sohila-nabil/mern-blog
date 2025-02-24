import { Router } from "express";
import {
  createPost,
  getposts,
  deletePost,
  updatePost,
} from "../controllers/postCtrl.js";
import verifyUser from "../utils/verifyUser.js";
const postRouter = Router();

postRouter.post("/create", verifyUser, createPost);
postRouter.get("/getposts", getposts);
postRouter.delete("/delete/:id", verifyUser, deletePost);
postRouter.put("/update/:id", verifyUser, updatePost);

export default postRouter;
