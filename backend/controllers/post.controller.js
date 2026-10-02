const crypto = require("crypto");
const Post = require("../models/Post");

// GET /api/posts -> all posts, newest first
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load posts" });
  }
};

// POST /api/posts -> save a new post { image, caption }
const createPost = async (req, res) => {
  try {
    const { image, caption } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Only accept images that live in YOUR ImageKit account
    const endpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").replace(/\/+$/, "");
    if (endpoint && !image.startsWith(endpoint)) {
      return res
        .status(400)
        .json({ message: "Image must be hosted on your ImageKit account" });
    }

    const post = await Post.create({
      image,
      caption: typeof caption === "string" ? caption.trim() : "",
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create post" });
  }
};

// GET /api/imagekit-auth -> one-time signature so the browser can upload to ImageKit.
// The PRIVATE key is used here on the server and is never sent to the browser.
const getImageKitAuth = (req, res) => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return res
      .status(500)
      .json({ message: "ImageKit keys are missing in backend/.env" });
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60; // valid for 30 minutes
  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  res.json({ token, expire, signature, publicKey });
};

module.exports = { getPosts, createPost, getImageKitAuth };
