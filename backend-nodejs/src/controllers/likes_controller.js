const Like = require("../models/Like");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports.toggleLike = async function (req, res, next) {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			// likes/toggle/?id=abcdef&type=Post
			let likeable;
			let deleted = false;

			if (req.query.likeable_type == "Post") {
				likeable = await Post.findById(req.query.likeable_id).populate("likes");
			} else {
				likeable = await Comment.findById(req.query.likeable_id).populate(
					"likes"
				);
			}

			// check if a like already exists
			let existingLike = await Like.findOne({
				likeable: req.query.likeable_id,
				onModel: req.query.likeable_type,
				user: req.user._id,
			});

			let likeId = '';

			// if a like already exists then delete it
			if (existingLike) {
				likeable.likes.pull(existingLike._id);
				likeable.save();

				// existingLike.remove();
				await Like.findByIdAndDelete(existingLike._id);
				deleted = true;
				likeId = existingLike._id;
			} else {
				// else make a new like

				let newLike = await Like.create({
					user: req.user._id,
					likeable: req.query.likeable_id,
					onModel: req.query.likeable_type,
				});

				likeable.likes.push(newLike._id);
				likeable.save();
				likeId = newLike._id;
			}

			return res.json(200, {
				message: "Request successful!",
				data: {
					id : likeId,
					deleted: deleted,
				},
			});
		} catch (err) {
			console.log(err);
			return res.json(500, {
				message: "Internal Server Error",
			});
		}
		next();
	} else {
		// JWT verification failed; send a custom error response
		res.status(401).json({ message: "Unauthorized" });
	}
};
