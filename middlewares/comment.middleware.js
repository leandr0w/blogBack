const Comment = require('../models/comments.model');
const AppError = require('../utils/app.error');
const catchAsync = require('../utils/catchAsync');

exports.commentExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: {
      status: 'active',
      id,
    },
  });
  if (!comment) {
    return next(new AppError(`Comment with id: ${id} not found`, 404));
  }
  req.comment = comment;
  next();
});
