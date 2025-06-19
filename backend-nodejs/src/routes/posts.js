// routes/posts.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controllers/posts_controller");

// Create a new post
router.post("/create", postController.createPost);

// Get all posts
router.get("/", postController.getAllPosts);

// Implement other CRUD operations for posts
// Add like and comment functionality

// router.get('/', postController.index);
router.delete("/:id", postController.destroy);

module.exports = router;
