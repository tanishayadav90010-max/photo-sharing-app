const express = require("express");
const {
  getPosts,
  createPost,
  getImageKitAuth,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.get("/imagekit-auth", getImageKitAuth);

module.exports = router;
