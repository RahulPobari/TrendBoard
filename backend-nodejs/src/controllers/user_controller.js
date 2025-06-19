const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const User = require('../models/user');
const Friendship = require("../models/friendship");
const fs = require("fs");
const path = require("path");
const {
	getToken,
	COOKIE_OPTIONS,
	getRefreshToken,
} = require("../../authenticate");

exports.register = async (req, res, next) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		// Check if the email is already registered
		const existingUser = await User.findOne({ email: email });

		if (existingUser) {
			res.statusCode = 400;
			res.send({
				name: "DuplicateEmailError",
				error: "Email already in use",
			});
		} else {
			// Hash the password
			if (!password) {
				res.statusCode = 500;
				res.send({
					name: "PasswordUndefined",
					error: "Password is Undefined",
				});
				return;
			}
			const hashedPassword = bcrypt.hashSync(password, 10);

			User.register(
				new User({ name, email, password: hashedPassword }),
				password,
				async (err, user) => {
					if (err) {
						console.log("Error: ", err);
						res.statusCode = 500;
						res.send(err);
					} else {
						const token = getToken({ _id: user._id });
						const refreshToken = getRefreshToken({ _id: user._id });
						user.refreshToken.push({ refreshToken });
						try {
							user.save();

							res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
							res.send({ success: true, token });
						} catch {
							res.statusCode = 500;
							res.send({
								name: "ServerError",
								error: err,
							});
						}
					}
				}
			);
		}
	} catch (error) {
		console.error(error);
		res.statusCode = 500;
		res.send({
			name: "ServerError",
			error: "Server Error",
		});
	}
};

exports.searchUserByText = async (req, res) => {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			const searchText = req.query.text; // Get the search text from the query parameter 'text'

			// Use a regular expression to perform a case-insensitive search
			const users = await User.find({
				$or: [
					{ name: { $regex: searchText, $options: "i" } }, // Search in the 'name' field
					{ email: { $regex: searchText, $options: "i" } }, // Search in the 'email' field
					// Add more fields as needed
				],
			});
			res.status(200).json(users);
		} catch (error) {
			console.error("Error From searchUserByText: ", error);
			res.status(500).json({ error: "Internal server error" + error });
		}
	} else {
		// JWT verification failed; send a custom error response
		res.status(401).json({ message: "Unauthorized" });
	}
};

exports.login = async (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			// Handle unexpected errors
			return res.status(500).json({ error: "Server error" });
		}
		if (!user) {
			// Authentication failed (user not found or incorrect password)
			return res.status(401).json({ message: info.message });
		}

		// If authentication is successful, log in the user
		req.logIn(user, (err) => {
			if (err) {
				// Handle login error
				return res.status(500).json({ error: "Login error" });
			}

			const resUser = {
				id: user._id,
				name: user.name,
				email: user.email,
				// friendship: user.friendship,
				avatar: user.avatar,
			};

			const token = getToken({ user: resUser });
			const refreshToken = getRefreshToken({ user: resUser });

			// const token = getToken({ _id: user._id });
			// const refreshToken = getRefreshToken({ _id: user._id });

			user.refreshToken.push({ refreshToken });
			try {
				user.save();
				// const resUser = {
				// 	id: user._id,
				// 	name: user.name,
				// 	email: user.email,
				// 	friendship: user.friendship,
				// 	avatar: user.avatar,
				// };
				res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
				res.status(200).json({ success: true, token });

				// res.status(200).json({ success: true, token, user: resUser });
			} catch (err) {
				res.statusCode = 500;
				res.send(err);
			}
		});
	})(req, res, next);
};

exports.currentUser = async (req, res, next) => {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			const user = req.user;
			const resUser = {
				id: user._id,
				name: user.name,
				email: user.email,
				friendship: user.friendship,
				avatar: user.avatar,
			};
			res.status(200).json({ user: resUser });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: "Internal server error" });
		}
		next();
	} else {
		// JWT verification failed; send a custom error response
		return res.status(401).json({ message: "Unauthorized" });
	}
};

exports.logout = async (req, res, next) => {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			console.log("req.cookies", req.cookies.refreshToken);
			console.log("req.headers.cookie", req.headers.cookie);
			// const { signedCookies = {} } = req;
			// const { refreshToken } = signedCookies;
			const refreshToken = req.headers.cookie;
			// Assuming that req.user is a Mongoose model instance
			// You can directly use it without .exec()
			const user = req.user;

			const tokenIndex = user.refreshToken.findIndex(
				(item) => item.refreshToken === refreshToken
			);

			if (tokenIndex !== -1) {
				// Remove the refreshToken from the array
				user.refreshToken.splice(tokenIndex, 1);

				// Save the user document
				await user.save();

				res.clearCookie("refreshToken", COOKIE_OPTIONS);
				res.json({
					success: true,
					message: "Refresh token removed successfully",
				});
			} else {
				res.json({
					success: true,
					message: "Refresh token does not exist",
				});
			}
		} catch (err) {
			console.error("Error from logout controller", err);
			res.statusCode = 500;
			res.json({ message: "Error saving user", Error: err });
		}
	} else {
		// JWT verification failed; send a custom error response
		res.status(401).json({ message: "Unauthorized" });
	}
};

// exports.logout = async (req, res, next) => {
// 	if (req.user) {
// 		// User is authenticated; continue to the protected route
// 		try {
// 			const { signedCookies = {} } = req;
// 			const { refreshToken } = signedCookies;
// 			req.user.exec().then((user) => {
// 				const tokenIndex = user.refreshToken.findIndex(
// 					(item) => item.refreshToken === refreshToken
// 				);

// 				if (tokenIndex !== -1) {
// 					// user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();

// 					try {
// 						// Remove the refreshToken from the array
// 						user.refreshToken.splice(tokenIndex, 1);

// 						user.save();

// 						res.clearCookie("refreshToken", COOKIE_OPTIONS);
// 						res.json({
// 							success: true,
// 							message: "Refresh token removed successfully",
// 						});
// 					} catch (err) {
// 						res.statusCode = 500;
// 						res.json({ message: "Error saving user", Error: err });
// 					}
// 				} else {
// 					res.json({
// 						success: true,
// 						message: "Refresh token does not exists",
// 					});
// 				}
// 			});
// 		} catch (err) {
// 			console.error('Error from logout controller', err)
// 			res.statusCode = 400;
// 			res.send(err);
// 		}
// 		next();
// 	} else {
// 		// JWT verification failed; send a custom error response
// 		res.status(401).json({ message: "Unauthorized" });
// 	}
// };

exports.getUserById = async (req, res, next) => {
	if (req.user) {
		// User is authenticated; continue to the protected route
		try {
			// Access the userId parameter from the URL
			const userId = req.params.userId;

			// Query the database or your data source to find the user by userId
			const user = await User.findById( userId );
			// Check if the user was found
			if (!user) {
				res.status(404).json({ message: "User not found" });
			} else {
				// Send a JSON response with the user data
				const resUser = {
					id: user._id,
					name: user.name,
					email: user.email,
					avatar: user.avatar,
				};
				res.status(200).json({ user: resUser }); // Send the first (and presumably only) user found
			}
		} catch (error) {
			// Handle any errors that occur during the database query or other operations
			console.error("Error getUserById: ", error);
			res.status(500).json({ message: "Internal server error" });
		}
		next();
	} else {
		// JWT verification failed; send a custom error response
		res.status(401).json({ message: "Unauthorized" });
	}
};

exports.refreshToken = async (req, res, next) => {
	// const { signedCookies = {} } = req;
	// const { refreshToken } = signedCookies;

	const cookies = req.cookies;

	if (!cookies?.refreshToken) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const refreshToken = cookies.jwt;

	if (refreshToken) {
		try {
			const payload = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET
			);
			const userId = payload._id;
			User.findOne({ _id: userId }).then(
				(user) => {
					if (user) {
						// Find the refresh token against the user record in database
						const tokenIndex = user.refreshToken.findIndex(
							(item) => item.refreshToken === refreshToken
						);

						if (tokenIndex === -1) {
							return res.status(401).json({ message: "Unauthorized" });
						} else {
							// const token = getToken({ _id: userId });
							const token = getToken(user);
							// If the refresh token exists, then create new one and replace it.
							// const newRefreshToken = getRefreshToken({ _id: userId });
							const newRefreshToken = getRefreshToken(user);

							user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
							try {
								user.save();

								res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
								res.send({ success: true, token });
							} catch (err) {
								return res.status(500).json({ message: err });
							}
						}
					} else {
						return res.status(401).json({ message: "Unauthorized" });
					}
				},
				(err) => next(err)
			);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

module.exports.update = async function (req, res) {
	if (req.user.id == req.params.id) {
		try {
			let user = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, function (err) {
				if (err) {
					console.log("*****Multer Error", err);
				}

				user.name = req.body.name;
				user.email = req.body.email;

				if (req.file) {
					if (user.avatar) {
						fs.unlinkSync(path.join(__dirname, "..", user.avatar));
					}

					//this is saving the path of uploaded file in the avatar field in the user
					user.avatar = User.avatarPath + "/" + req.file.filename;
				}

				user.save();
				return res.redirect("back");
			});
		} catch {
			req.flash("error", err);
			return res.redirect("back");
		}
	} else {
		req.flash("error", "Unauthorized!");
		return res.status(401).send("Unauthorized");
	}
};
