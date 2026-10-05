const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const { post_id, content } = req.body;
  try {
    const comment = new Comment({ post: post_id, user: req.user.id, content });
    await comment.save();
    
    // Populate user metadata immediately for return payload
    const populated = await comment.populate('user', 'username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};