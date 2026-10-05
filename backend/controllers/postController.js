const Post = require('../models/Post');
const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const slug = `${slugify(title)}-${Date.now()}`;
  try {
    const newPost = new Post({ author: req.user.id, title, slug, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { search } = req.query;
    let queryFilter = {};

    // If a search query is provided, match title or content case-insensitively
    if (search) {
      queryFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const posts = await Post.find(queryFilter)
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Fetch posts belonging ONLY to the logged-in user
exports.getUserPosts = async (req, res) => {
  try {
    // req.user.id comes directly from our auth middleware token verification
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Security Guard: Check if the logged-in user is the post's author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own posts.' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};