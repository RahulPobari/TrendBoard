// controllers/posts.js
const Post = require("../models/Post");

// Controller functions for Posts
module.exports = {
	// Create a new post
	createPost: async (req, res, next) => {
		if (req.user) {
			// User is authenticated; continue to the protected route
			try {
				const newPost = new Post({
					user: req.user.id,
					content: req.body.content, // Change 'text' to 'content'
					email: req.user.email, // Assuming you have a 'userName' field in your user model
				});

				const savedPost = await newPost.save();
				res.status(201).json(savedPost); // Use status 201 for resource creation
			} catch (error) {
				console.error("Error creating post:", error);
				res.status(500).json({ message: "Server error" }); // Handle error gracefully
			}
			next();
		} else {
			// JWT verification failed; send a custom error response
			res.status(401).json({ message: "Unauthorized" });
		}
	},

	// Route to fetch posts with pagination
	getAllPosts: async (req, res, next) => {
		if (req.user) {
			// User is authenticated; continue to the protected route
			try {
				const { page, limit } = req.query;
				const currentPage = parseInt(page, 10) || 1;
				const postsPerPage = parseInt(limit, 10) || 5;

				// Calculate the number of documents to skip based on pagination
				const skip = (currentPage - 1) * postsPerPage;

				// Query the database to fetch posts with pagination
				const posts = await Post.find()
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(postsPerPage)
					// .populate('user', ['username'])
	      			// .exec();

				res.status(200).json(posts);
			} catch (error) {
				console.error(error.message);
				res.status(500).json({ message: "Server Error"});
			}
			next();
		} else {
			// JWT verification failed; send a custom error response
			res.status(401).json({ message: "Unauthorized" });
		}
	},

	// // Get all posts
	// getAllPosts: async (req, res) => {
	//   try {
	//     const posts = await Post.find()
	//       .sort({ date: -1 })
	//       .populate('user', ['username'])
	//       .exec();

	//     res.json(posts);
	//   } catch (error) {
	//     console.error(error);
	//     res.status(500).json({ error: 'Internal server error' });
	//   }
	// },

	// Implement other CRUD operations for posts
	// Add like and comment functionality

	index: async function (req, res) {
		let posts = await Post.find({})
			.sort("-createdAt")
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "user",
				},
			});

		return res.json(200, {
			message: "List of posts",
			posts: posts,
		});
	},

	destroy: async function (req, res) {
		try {
			let post = await Post.findById(req.params.id);

			if (post.user == req.user.id) {
				post.remove();

				await Comment.deleteMany({ post: req.params.id });

				return res.json(200, {
					message: "Post and associated comments deleted successfully",
				});
			} else {
				return res.json(401, {
					message: "You cannot delete this post!",
				});
			}
		} catch (err) {
			console.log("**********from post destroy controller", err);
			return res.json(500, {
				message: "Internal Server Error",
			});
		}
	},
};
