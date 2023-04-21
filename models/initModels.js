const PostImg = require('./postimg.model');
const Post = require('./../models/post.model');
const Comment = require('./../models/comments.model');
const User = require('./../models/user.models');

const initModel = () => {
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Comment);
  Comment.belongsTo(User);

  Post.hasMany(Comment);
  Comment.belongsTo(Post);

  Post.hasMany(PostImg);
  PostImg.belongsTo(Post);
};

module.exports = initModel;
