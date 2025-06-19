// routes/comments.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const Comment = require("../models/Comment");
const commentController = require('../controllers/comments_controller');
// Create a new comment
router.post("/", commentController.createComment);

// Get comment by commentId
router.get("/fetchCommentById", commentController.fetchCommentById);

// Get comments by comments Ids Array
router.post("/fetchCommentsByIdsArr", commentController.fetchCommentsByIdsArr);

// Get all comments for a post
router.get("/:postId", commentController.getCommentsByPostId);

// Implement other CRUD operations for comments

module.exports = router;
