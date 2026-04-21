const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { comments, users, posts } = require('../utils/mockData');

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404));
  }

  const postComments = comments
    .filter(c => c.post_id === req.params.postId)
    .map(comment => {
      const user = users.find(u => u.id === comment.user_id);
      return { ...comment, user: { id: user.id, username: user.username, profile_picture: user.profile_picture } };
    });

  res.status(200).json({ success: true, count: postComments.length, data: postComments });
});

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = comments.find(c => c.id === req.params.id);
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }
  const user = users.find(u => u.id === comment.user_id);
  res.status(200).json({ success: true, data: { ...comment, user: { id: user.id, username: user.username } } });
});

// @desc    Create comment
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) return next(new ErrorResponse('Not authorized', 401));

  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return next(new ErrorResponse(`Post not found`, 404));

  const newComment = {
    id: (comments.length + 1).toString(),
    text: req.body.text,
    user_id: userId,
    post_id: req.params.postId,
    created_at: new Date().toISOString().slice(0, 10)
  };

  comments.push(newComment);
  post.comments_count += 1;

  res.status(201).json({ success: true, data: newComment });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) return next(new ErrorResponse('Not authorized', 401));

  const comment = comments.find(c => c.id === req.params.id);
  if (!comment) return next(new ErrorResponse(`Comment not found`, 404));
  if (comment.user_id !== userId) return next(new ErrorResponse('Not authorized to update this comment', 401));

  const index = comments.findIndex(c => c.id === req.params.id);
  comments[index] = { ...comment, text: req.body.text || comment.text };

  res.status(200).json({ success: true, data: comments[index] });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) return next(new ErrorResponse('Not authorized', 401));

  const comment = comments.find(c => c.id === req.params.id);
  if (!comment) return next(new ErrorResponse(`Comment not found`, 404));
  if (comment.user_id !== userId) return next(new ErrorResponse('Not authorized to delete this comment', 401));

  const index = comments.findIndex(c => c.id === req.params.id);
  comments.splice(index, 1);

  res.status(200).json({ success: true, data: {} });
});
