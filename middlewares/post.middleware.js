const Post = require('../models/post.model');
const User = require('../models/user.models');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: User,
      },
    ],
  });
  if (!post) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }

  req.post = post;
  req.user = post.user;
  next();
});
