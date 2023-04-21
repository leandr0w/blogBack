const Post = require('../models/post.model');
const User = require('../models/user.models');
const catchAsync = require('./../utils/catchAsync');

exports.findAll = catchAsync(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'passwordChangedAt', 'status'] },
    where: {
      status: 'active',
    },
    include: [
      {
        model: Post,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.findOne = catchAsync(async (req, res) => {
  const { user } = req;

  return res.status(200).json({
    status: 'success',
    user,
  });
});

exports.update = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  const { user } = req;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: 'The user has been updated',
    user,
  });
});
exports.delete = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({
    status: 'disabled',
  });

  return res.status(200).json({
    status: 'success',
    message: 'The user has been deleted',
    user,
  });
});
