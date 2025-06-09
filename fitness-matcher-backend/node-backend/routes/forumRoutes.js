// routes/forumRoutes.js
const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/posts", authMiddleware, forumController.getAllPosts);
router.post("/posts", authMiddleware, forumController.createPost);
router.patch('/posts/:post_id/like', authMiddleware, forumController.toggleLike);
module.exports = router;
