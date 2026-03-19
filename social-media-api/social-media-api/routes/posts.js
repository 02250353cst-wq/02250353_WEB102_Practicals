const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const router = express.Router();

// Include comment and like routes
const { getComments, createComment } = require('../controllers/commentController');
const { getLikes, likePost, unlikePost } = require('../controllers/likeController');

router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPost).put(updatePost).delete(deletePost);

// Comment sub-routes
router.route('/:postId/comments').get(getComments).post(createComment);

// Like sub-routes
router.route('/:postId/likes').get(getLikes).post(likePost).delete(unlikePost);

module.exports = router;
