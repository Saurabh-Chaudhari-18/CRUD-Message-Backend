const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Post = require("./models/Post");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*", // Update with your frontend URL during development
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/api/posts", async (req, res) => {
  const { name, message } = req.body;
  try {
    const newPost = new Post({ name, message });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, message } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { name, message },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
