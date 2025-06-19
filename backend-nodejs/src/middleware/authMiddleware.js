// middleware/authMiddleware.js

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); // User is authenticated, proceed to the next middleware
	}
	return res.status(401).json({ message: 'Unauthorized' }); // Redirect to the login page if not authenticated
}

module.exports = isAuthenticated;
