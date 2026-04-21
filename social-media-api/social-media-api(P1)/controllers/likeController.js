const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes, posts } = require('../utils/mockData');

// @desc    Get all likes for a post
// @route   GET /api/posts/:postId/likes
// @access  Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return next(new ErrorResponse(`Post not found`, 404));

  const postLikes = likes.filter(l => l.post_id === req.params.postId);
  res.status(200).json({ success: true, count: postLikes.length, data: postLikes });
});

// @desc    Like a post
// @route   POST /api/posts/:postId/likes
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) return next(new ErrorResponse('Not authorized', 401));

  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return next(new ErrorResponse(`Post not found`, 404));

  const existingLike = likes.find(l => l.post_id === req.params.postId && l.user_id === userId);
  if (existingLike) return next(new ErrorResponse('Post already liked', 400));

  const newLike = {
    id: (likes.length + 1).toString(),
    user_id: userId,
    post_id: req.params.postId,
    created_at: new Date().toISOString().slice(0, 10)
  };

  likes.push(newLike);
  post.likes_count += 1;

  res.status(201).json({ success: true, data: newLike });
});

// @desc    Unlike a post
// @route   DELETE /api/posts/:postId/likes
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) return next(new ErrorResponse('Not authorized', 401));

  const likeIndex = likes.findIndex(l => l.post_id === req.params.postId && l.user_id === userId);
  if (likeIndex === -1) return next(new ErrorResponse('Like not found', 404));

  likes.splice(likeIndex, 1);
  const post = posts.find(p => p.id === req.params.postId);
  if (post) post.likes_count = Math.max(0, post.likes_count - 1);

  res.status(200).json({ success: true, data: {} });
});
