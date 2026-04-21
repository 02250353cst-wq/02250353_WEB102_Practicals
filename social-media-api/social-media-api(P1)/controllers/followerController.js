const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers, users } = require('../utils/mockData');

// @desc    Get followers of a user
// @route   GET /api/users/:userId/followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return next(new ErrorResponse(`User not found`, 404));

  const userFollowers = followers
    .filter(f => f.following_id === req.params.userId)
    .map(f => {
      const followerUser = users.find(u => u.id === f.follower_id);
      return { ...f, follower: { id: followerUser.id, username: followerUser.username, profile_picture: followerUser.profile_picture } };
    });

  res.status(200).json({ success: true, count: userFollowers.length, data: userFollowers });
});

// @desc    Get users that a user is following
// @route   GET /api/users/:userId/following
// @access  Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return next(new ErrorResponse(`User not found`, 404));

  const userFollowing = followers
    .filter(f => f.follower_id === req.params.userId)
    .map(f => {
      const followingUser = users.find(u => u.id === f.following_id);
      return { ...f, following: { id: followingUser.id, username: followingUser.username, profile_picture: followingUser.profile_picture } };
    });

  res.status(200).json({ success: true, count: userFollowing.length, data: userFollowing });
});

// @desc    Follow a user
// @route   POST /api/users/:userId/followers
// @access  Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const currentUserId = req.header('X-User-Id');
  if (!currentUserId) return next(new ErrorResponse('Not authorized', 401));
  if (currentUserId === req.params.userId) return next(new ErrorResponse('Cannot follow yourself', 400));

  const userToFollow = users.find(u => u.id === req.params.userId);
  if (!userToFollow) return next(new ErrorResponse(`User not found`, 404));

  const existingFollow = followers.find(f => f.follower_id === currentUserId && f.following_id === req.params.userId);
  if (existingFollow) return next(new ErrorResponse('Already following this user', 400));

  const newFollow = {
    id: (followers.length + 1).toString(),
    follower_id: currentUserId,
    following_id: req.params.userId,
    created_at: new Date().toISOString().slice(0, 10)
  };

  followers.push(newFollow);
  res.status(201).json({ success: true, data: newFollow });
});

// @desc    Unfollow a user
// @route   DELETE /api/users/:userId/followers
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const currentUserId = req.header('X-User-Id');
  if (!currentUserId) return next(new ErrorResponse('Not authorized', 401));

  const followIndex = followers.findIndex(f => f.follower_id === currentUserId && f.following_id === req.params.userId);
  if (followIndex === -1) return next(new ErrorResponse('Not following this user', 404));

  followers.splice(followIndex, 1);
  res.status(200).json({ success: true, data: {} });
});
