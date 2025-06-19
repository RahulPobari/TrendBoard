const express = require("express");
const router = express.Router();
const passport = require("passport");
const CircularJSON = require('circular-json');

const userController = require('../controllers/user_controller');
const { verifyUser } = require("../../authenticate");

router.post("/signup", userController.register);
router.post("/login",  userController.login);
router.get("/logout", passport.authenticate("jwt", { session: false }), userController.logout);
router.post("/refreshToken", userController.refreshToken);
// // logged in user details
router.get("/currentUser", passport.authenticate("jwt", { session: false }), userController.currentUser);
router.get('/getUser/:userId', passport.authenticate("jwt", { session: false }), userController.getUserById);
router.get('/search', passport.authenticate("jwt", { session: false }), userController.searchUserByText);

module.exports = router;
