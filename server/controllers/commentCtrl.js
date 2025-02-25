import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";
import errorHandler from "../utils/errorHandler.js";

export const createComment = async (req, res, next) => {
  try {
    const { comment, postId, userId } = req.body;
    console.log("userId", userId);
    console.log("req.user.id", req.user.id);
    console.log(req.body);

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }
    const newComment = new Comment({
      comment,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json({ success: true, newComment });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeOrDislikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(400, "comment not exist"));
    console.log(req.user.id);

    let user = await User.findById(req.user.id);
    console.log(user);

    if (!user) return next(errorHandler(400, "you must register"));
    const userIndex = comment.likes.indexOf(user._id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
