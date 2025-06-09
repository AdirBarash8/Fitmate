const Post = require('../models/post');

exports.createPost = async (req, res) => {
  try {
    const { content, authorName } = req.body;
    const user_id = req.user?.user_id; // ← שדה תואם למודל שלך

    if (!user_id || !content) {
      return res.status(400).json({ error: "Missing user_id or content" });
    }

    const post = new Post({
      user_id, // ← תואם למודל
      authorName: authorName || "Anonymous",
      content,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error creating post:", err.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.toggleLike = async (req, res) => {
  const user_id = req.user.user_id;
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const hasLiked = post.likes.includes(user_id.toString());

    if (hasLiked) {
      post.likes = post.likes.filter(id => id !== user_id.toString()); // unlike
    } else {
      post.likes.push(user_id); // like
    }

    await post.save();

    res.json({
      liked: !hasLiked,
      post, // return updated post
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

