const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use("/users", require("./users"));
router.use("/", passport.authenticate("jwt", { session: false }), require("./protected"));

module.exports = router;
