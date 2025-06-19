const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../src/models/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		// const userQuery = User.findOne({ _id: jwt_payload._id });
		const userQuery = User.findOne({ _id: jwt_payload.user.id });
		userQuery
			.exec()
			.then((user) => {
				if (user) {
					return done(null, user);
				} else {
					console.log("I was here, JwtStrategy")
					return done(null, false, { message: 'User not found' });
				}
			})
			.catch((err) => {
				console.log("I was here, JwtStrategy")
				return done(err, false, { message: 'Internal Server Error' });
			});
	})
);
