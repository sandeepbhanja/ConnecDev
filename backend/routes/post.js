import express from "express";
import { auth } from "../middleware/auth.js";
import { check, validationResult } from "express-validator";

import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();

//Post
// api/post
//private
router.post(
  "/",
  [auth, [check("text", "text is required").not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user._id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (e) {
      console.log(e);
    }
  }
);

//Get
// api/post
//private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", ["name", "avatar"])
      .sort({ date: -1 });
    if (posts) {
      res.status(200).json(posts);
    } else {
      throw new Error("No posts found");
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      throw new Error("No post found");
    }
  } catch (e) {
    console.log(e);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.user.id) {
      res.status(404).json("You are not allowed to delete");
    } else {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("Post deleted successfully");
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json(400).json({ msg: "User already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.log(e);
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.json(400).json({ msg: "User has not liked" });
    }
    const returnIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(returnIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user._id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      console.log(e);
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "comment not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Cannot Delete" });
    }
    const returnIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(returnIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (e) {
    console.log(e);
  }
});

export default router;
