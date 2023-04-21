const Comment = require('../models/comments.model');
const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user.models');

exports.findAllPost = catchAsync(async (req, res, next) => {
  const post = await Post.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['userId', 'status'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl'],
      },
      {
        model: Comment,
        attributes: ['text', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: post.length,
    post,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const post = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });
  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
  });
});
exports.findUserPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const posts = await Post.findAll({
    where: {
      userId: id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'passwordChangedAt'] },
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findMyPost = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const post = await Post.findAll({
    where: {
      userId: sessionUser.id,
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Your posts',
    post,
  });
});

exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  res.status(200).json({
    status: 'success',
    post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  const { post } = req;

  await post.update({
    title,
    content,
  });

  res.status(200).json({
    status: 'success',
    message: 'The post has been update',
    post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({
    status: 'disabled',
  });
  return res.status(200).json({
    status: 'success',
    message: 'The post has been deleted',
  });
});
