const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Include follower routes
const { getFollowers, getFollowing, followUser, unfollowUser } = require('../controllers/followerController');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

// Follower sub-routes
router.route('/:userId/followers').get(getFollowers).post(followUser).delete(unfollowUser);
router.route('/:userId/following').get(getFollowing);

module.exports = router;
