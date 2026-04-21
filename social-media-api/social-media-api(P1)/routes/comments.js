const express = require('express');
const {
  getComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

router.route('/:id').get(getComment).put(updateComment).delete(deleteComment);

module.exports = router;
