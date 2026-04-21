const dataStore = require('../models');

// GET all comments
const getAllComments = (req, res) => {
    res.status(200).json(dataStore.comments);
};

// GET comment by ID
const getCommentById = (req, res) => {
    const commentId = parseInt(req.params.id);
    const comment = dataStore.comments.find(c => c.id === commentId);

    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
};

// POST create a new comment
const createComment = (req, res) => {
    const { text, userId, videoId } = req.body;

    if (!text || !userId || !videoId) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    const userExists = dataStore.users.some(u => u.id === parseInt(userId));
    const videoExists = dataStore.videos.some(v => v.id === parseInt(videoId));

    if (!userExists || !videoExists) {
        return res.status(400).json({ error: 'User or Video does not exist' });
    }

    const newComment = {
        id: dataStore.nextIds.comments++,
        text,
        userId: parseInt(userId),
        videoId: parseInt(videoId),
        likes: [], // Initialize empty likes array
        createdAt: new Date().toISOString()
    };

    dataStore.comments.push(newComment);
    res.status(201).json(newComment);
};

// PUT update a comment
const updateComment = (req, res) => {
    const commentId = parseInt(req.params.id);
    const comment = dataStore.comments.find(c => c.id === commentId);

    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    const { text } = req.body;
    if (text) comment.text = text;
    
    comment.updatedAt = new Date().toISOString();
    res.status(200).json(comment);
};

// DELETE a comment
const deleteComment = (req, res) => {
    const commentId = parseInt(req.params.id);
    const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    dataStore.comments.splice(commentIndex, 1);
    res.status(204).end();
};

// POST like a comment
const likeComment = (req, res) => {
    const commentId = parseInt(req.params.id);
    const { userId } = req.body;
    const comment = dataStore.comments.find(c => c.id === commentId);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    if (comment.likes.includes(parseInt(userId))) {
        return res.status(400).json({ error: 'Already liked this comment' });
    }

    comment.likes.push(parseInt(userId));
    res.status(200).json({ message: 'Comment liked', likesCount: comment.likes.length });
};

// DELETE unlike a comment
const unlikeComment = (req, res) => {
    const commentId = parseInt(req.params.id);
    const { userId } = req.body;
    const comment = dataStore.comments.find(c => c.id === commentId);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const likeIndex = comment.likes.indexOf(parseInt(userId));
    if (likeIndex === -1) {
        return res.status(400).json({ error: 'Comment not liked yet' });
    }

    comment.likes.splice(likeIndex, 1);
    res.status(200).json({ message: 'Comment unliked', likesCount: comment.likes.length });
};

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
};