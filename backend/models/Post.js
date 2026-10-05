const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  status: { type: String, default: 'Published', enum: ['Draft', 'Published'] }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);