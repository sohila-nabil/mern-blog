import Post from "../models/postModel.js";
import errorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res, next) => {
  const { userId, content, title, category } = req.body;
  const image = req?.files?.image;
  let slug;

  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if (!content || !title) {
      return next(errorHandler(400, "all fields are required"));
    }
    let uploadedImage;
    if (image) {
      const { tempFilePath } = image;
      uploadedImage = await cloudinary.uploader.upload(tempFilePath, {
        folder: "blog",
      });
      if (!uploadedImage || uploadedImage.error) {
        return next(errorHandler(500, "image upload failed"));
      }
    }
    if (title) {
      slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    }
    const post = await Post.findOne({ title });
    if (post) {
      return next(errorHandler(400, "post with this title already exists"));
    }
    const newPost = new Post({
      userId: req.user.id,
      content,
      title,
      image: {
        public_id: uploadedImage?.public_id,
        url: uploadedImage?.secure_url || image,
      },
      category,
      slug,
    });
    await newPost.save();
    res
      .status(200)
      .json({ success: true, message: "post created successfully", newPost });
  } catch (error) {
    next(error);
  }
};

const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    if (!posts || posts.length === 0) {
      return next(errorHandler(404, "no posts found"));
    }
    if (!totalPosts) {
      return next(errorHandler(404, "no posts found"));
    }
    if (!lastMonthPosts) {
      return next(errorHandler(404, "no posts found"));
    }

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const imageFile = req.files?.image;  
  const data = { ...req.body };

  // Remove _id from the update data, if it exists
  if (data._id) {
    delete data._id;
  }
  try {
    if (!req.user.isAdmin)
      return next(errorHandler(403, "You are not allowed to create a post"));
    const post = await Post.findById(id);
    if (req.user.id !== post.userId)
      return next(errorHandler(403, "You are not allowed to create a post"));
    if (imageFile) {
      if (post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      const cloudRes = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: 'blog',
      });
      data.image = {
        public_id: cloudRes.public_id,
        url: cloudRes.secure_url,
      };
    }
    if (data.title) {
      // data.title = title;
      data.slug = data.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    }
    const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({ success: true, updatedPost });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!req.user?.isAdmin)
      return next(errorHandler(403, "You are not allowed to delete a post"));
    const post = await Post.findById(id);
    if (!post) return next(errorHandler(403, "post not exist"));
    if (req.user.id !== post.userId)
      return next(errorHandler(403, "You are not allowed to delete a post"));
    if (post.image.public_id && post.image.public_id !== "") {
      await cloudinary.uploader.destroy(post.image.public_id);
    }
    await post.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Post Deleted successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};



export { createPost, getposts, deletePost,updatePost };
