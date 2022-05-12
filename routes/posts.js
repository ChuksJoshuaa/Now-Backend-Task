import express from "express";

const router = express();

import {
  getAllPosts,
  getUserPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  replyPost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

router.get("/", auth, getUserPosts);
router.get("/allPosts", getAllPosts);
router.get("/v1/:id", getPost);
router.post("/", auth, createPost);
router.patch("/v1/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/replyPost", auth, replyPost);

export default router;
