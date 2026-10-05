const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost,
        getAllPosts, 
        getPostBySlug, 
        getUserPosts,
        deletePost} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', getAllPosts);
router.get('/me', auth, getUserPosts);
router.get('/:slug', getPostBySlug);
router.delete('/:id', auth, deletePost);

module.exports = router;