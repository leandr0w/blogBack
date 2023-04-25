const Post = require('../models/post.model');
const User = require('../models/user.models');
const catchAsync = require('./../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const { storage } = require('./../utils/firebase');

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

  const userPromises = users.map(async (user) => {
    const imgRef = ref(storage, user.profileImgUrl);

    const url = await getDownloadURL(imgRef);

    user.profileImgUrl = url;

    return user;
  });

  const userResolved = await Promise.all(userPromises);

  res.status(200).json({
    status: 'success',
    results: users.length,
    users: userResolved,
  });
});

exports.findOne = catchAsync(async (req, res) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  user.profileImgUrl = url;

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
