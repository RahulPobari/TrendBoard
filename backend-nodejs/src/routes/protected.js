// routes/posts.js
const express = require("express");
const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/home_controller");
const postController = require("../controllers/posts_controller");

router.get("/", homeController.home);
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/password", require("./password"));
router.use("/likes", require("./likes"));
router.use("/friendship", require("./friendship"));

module.exports = router;
