const User = require("../models/User");
const Friendship = require("../models/friendship");

module.exports.add = async function (req, res) {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			let to_user = await User.findById(req.query.user_id);
			let from_user = await User.findById(req.user._id);

			let user_friendship_to = await User.findById(to_user).populate(
				"friendship"
			);
			let user_friendship_from = await User.findById(from_user).populate(
				"friendship"
			);

			let newFriendship = await Friendship.create({
				from_user: from_user,
				to_user: to_user,
			});

			user_friendship_to.friendship.push(newFriendship);
			await user_friendship_to.save();

			user_friendship_from.friendship.push(newFriendship);
			await user_friendship_from.save();

			// Send a success JSON response
			return res.status(200).json({
				newFriend: {
					id: newFriendship._id,
					name: user_friendship_to.name,
					email: user_friendship_to.email,
				},
				message: "Friendship added successfully",
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Internal Server Error",
			});
		}
	} else {
		// JWT verification failed; send a custom error response
		return res.status(401).json({ message: "Unauthorized" });
	}
};

module.exports.remove = async function (req, res) {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			let to_user = await User.findById(req.query.user_id);
			let from_user = await User.findById(req.user._id);

			let user_friendship_to = await User.findById(to_user).populate(
				"friendship"
			);
			let user_friendship_from = await User.findById(from_user).populate(
				"friendship"
			);

			let existingFriendship_1 = await Friendship.findOne({
				from_user: from_user,
				to_user: to_user,
			});

			if (existingFriendship_1) {
				user_friendship_to.friendship.pull(from_user);
				user_friendship_to.save();

				user_friendship_from.friendship.pull(to_user);
				user_friendship_from.save();

				await Friendship.findByIdAndRemove(existingFriendship_1._id);

				//   existingFriendship_1.remove();

				return res.status(200).json({ message: "Friend Removed" });
			} else {
				let existingFriendship_2 = await Friendship.findOne({
					from_user: to_user,
					to_user: from_user,
				});

				user_friendship_to.friendship.pull(from_user);
				user_friendship_to.save();

				user_friendship_from.friendship.pull(to_user);
				user_friendship_from.save();

				existingFriendship_2.remove();

				return res.status(200).json({ message: "Friend Removed" });
			}
		} catch (err) {
			console.log("In the friendship controller", err);
			return res.status(500).json({ error: "Error in removing friend" });
		}
	} else {
		// JWT verification failed; send a custom error response
		return res.status(401).json({ message: "Unauthorized" });
	}
};

module.exports.fetchUserFriends = async (req, res) => {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			// Assuming you have the user's ID available in the request (e.g., req.user.id)
			const userId = req.user._id;
			// Find the user by their ID and populate the 'friendship' field to get friend details
			const user = await User.findById(userId);
			const friendshipIds = user.friendship;
			// Assuming you have an array of friend object IDs

			// Find the friends with the specified IDs
			const friends = await Friendship.find({ _id: { $in: friendshipIds } });

			const friends_otherUserIds = friends.map((f) => {
				if (f.to_user._id === userId) {
					return f.from_user._id;
				}
				return f.to_user._id;
			});

			const friendList = await User.find({
				_id: { $in: friends_otherUserIds },
			});

			if (!friendList) {
				return res.status(404).json({ error: "Friendship not found" });
			}
			// Send the friend list as a JSON response
			const res_friendList = friendList.map((friend) => {
				return {
					id: friend._id,
					name: friend.name,
					email: friend.email,
				};
			});
			res.status(200).json({ friends: res_friendList });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		// JWT verification failed; send a custom error response
		return res.status(401).json({ message: "Unauthorized" });
	}
};
