// controllers/comments.js
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Controller functions for Comments
module.exports = {
	// Create a new comment
	createComment: async (req, res) => {
		if (req.user) {
			// User is authenticated; continue to the protected route
			try {
				const { userId } = req.user._id; // Assuming you have userId in req.user
				const { post_id, content } = req.body;

				// Check if the post exists
				const post = await Post.findById(post_id);
				if (!post) {
					return res.status(404).json({ error: "Post not found" });
				}

				// Create a new comment instance
				const newComment = new Comment({
					user: userId,
					userName: req.user.name,
					post: post_id,
					content: content,
				});

				// Save the new comment to the database
				const comment = await newComment.save();

				// Add the comment to the post's comments array
				post.comments.push(comment._id);
				await post.save();

				// Return the newly created comment as JSON response
				res.status(201).json({ comment });
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal server error" });
			}
		} else {
			// JWT verification failed; send a custom error response
			res.status(401).json({ message: "Unauthorized" });
		}
	},

	// Get comment by Id
	fetchCommentById: async (req, res) => {
		if (req.user) {
			// User is authenticated; continue to the protected route
			try {
				const comment_id = req.query.comment_id;

				// Check if the post exists
				const comment = await Comment.findById(comment_id);
				if (!comment) {
					return res.status(404).json({ error: "Comment not found" });
				}
				// Return the newly created comment as JSON response
				res.status(201).json({ comment });
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal server error" });
			}
		} else {
			// JWT verification failed; send a custom error response
			res.status(401).json({ message: "Unauthorized" });
		}
	},

	//Get comments by comment Ids array
	fetchCommentsByIdsArr: async (req, res) => {
		if (req.user) {
			console.log("********User_id: ", req.user.name);
			// User is authenticated; continue to the protected route
			try {
				const comment_idsArr = req.body.comment_idsArr;
				console.log("********comment_idsArr: ", comment_idsArr);

				// Find the comments with the specified IDs
				const comments = await Comment.find({ _id: { $in: comment_idsArr } });

				// Check if the comments exists
				if (!comments) {
					return res.status(404).json({ error: "Comments not found" });
				}
				// Return the newly created comment as JSON response
				res.status(201).json({ comments });
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal server error" });
			}
		} else {
			// JWT verification failed; send a custom error response
			res.status(401).json({ message: "Unauthorized" });
		}
	},

	// Get all comments for a post
	getCommentsByPostId: (req, res) => {
		Comment.find({ post: req.params.postId })
			.populate("user", ["username"])
			.exec((err, comments) => {
				if (err) {
					return res.status(500).json({ error: "Internal server error" });
				}
				res.json(comments);
			});
	},

	// Implement other CRUD operations for comments
};
