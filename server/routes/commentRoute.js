import { Router } from "express";
import verifyUser from "../utils/verifyUser.js";
import { createComment, getPostComments,likeOrDislikeComment,deleteComment,editComment } from "../controllers/commentCtrl.js";

const commentRoute = Router();

commentRoute.post("/create-comment", verifyUser, createComment);
commentRoute.get("/get-comments/:postId", verifyUser, getPostComments);
commentRoute.put("/like-comment/:commentId", verifyUser, likeOrDislikeComment);
commentRoute.put("/update/:commentId", verifyUser, editComment);
commentRoute.delete("/delete/:commentId", verifyUser, deleteComment);
export default commentRoute;
