const passport = require("passport");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV; //"development" or "production"

exports.COOKIE_OPTIONS = {
	httpOnly: true, //accessible only by web server
	secure: env !== "development", // Since localhost is not having https protocol || secure cookies do not work correctly (in postman)
	// signed: true,
	sameSite: "none", //cross site cookie
	maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY),
};

exports.getToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: eval(process.env.SESSION_EXPIRY),
	});
};

exports.getRefreshToken = (user) => {
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
	});
	return refreshToken;
};

exports.verifyUser = passport.authenticate("jwt", { session: false });
