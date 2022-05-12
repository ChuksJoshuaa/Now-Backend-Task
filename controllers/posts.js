import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import createCustomError from "../errors/custom-error.js";

//get all thoughts created by one user
export const getUserPosts = async (req, res) => {
  try {
    const posts = await PostMessage.find({ creator: req.userId });

    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(404).json({ msg: error.msg });
  }
};

//get all users thought including the non-anonymous ones
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostMessage.find({});
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(404).json({ msg: error.msg });
  }
};

//get single thought
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: error.msg });
  }
};

// create thought
export const createPost = async (req, res) => {
  const post = req.body;

  const { title, message } = post;

  try {
    if (title === "" || message === "") {
      return next(createCustomError("Please fill in the form completely", 404));
    } else {
      const newPost = new PostMessage({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString(),
      });
      await newPost.save();
      res.status(201).json({ newPost });
    }
  } catch (error) {
    res.status(409).json({ msg: error.msg });
  }
};

//update thought
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  const { title, message } = post;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with id: ${_id}`);
  } else {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { title, message },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedPost);
  }
};

//delete thought
export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with id: ${_id}`);
  } else {
    await PostMessage.findByIdAndDelete(_id);
  }
  res.status(200).send("Post was deleted Successfully");
};

//Reply thought
export const replyPost = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(_id);

  post.reply.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedPost);
};
