const Comment = require('../models/comments.model');
const catchAsync = require('../utils/catchAsync');

exports.findAllComents = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: 'active',
    },
  });
  res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  const { postId } = req.params;

  const { sessionUser } = req;

  const comment = await Comment.create({
    text,
    postId,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Comment created',
    comment,
  });
});

exports.findCommentById = catchAsync(async (req, res, next) => {
  const { comment } = req;
  res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  const { text } = req.body;

  await comment.update({
    text,
  });
  res.status(200).json({
    status: 'success',
    message: 'The comment has been changed',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'disabled' });

  res.status(200).json({
    status: 'suceess',
    message: 'The commen has deleted',
  });
});
