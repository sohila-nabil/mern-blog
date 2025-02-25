import { Router } from "express";
import verifyUser from "../utils/verifyUser.js";
import { createComment, getPostComments,likeOrDislikeComment } from "../controllers/commentCtrl.js";

const commentRoute = Router();

commentRoute.post("/create-comment", verifyUser, createComment);
commentRoute.get("/get-comments/:postId", verifyUser, getPostComments);
commentRoute.put("/like-comment/:commentId", verifyUser, likeOrDislikeComment);
export default commentRoute;
