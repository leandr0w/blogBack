const Comment = require('../models/comments.model');
const Post = require('../models/post.model');
const PostImg = require('../models/postimg.model');
const catchAsync = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const User = require('./../models/user.models');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

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
        model: PostImg,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const postsPromises = post.map(async (post) => {
    const postImgPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });
    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlProfile = await getDownloadURL(imgRefUser);

    post.user.profileImgUrl = urlProfile;

    const postImgsResolved = await Promise.all(postImgPromises);
    post.postImg = postImgsResolved;

    return post;
  });

  const postResolved = await Promise.all(postsPromises);

  res.status(200).json({
    status: 'success',
    results: post.length,
    post: postResolved,
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

  const postImgPromises = req.files.map(async (file) => {
    const imgRef = ref(storage, `posts/${Date.now()}-${file.originalname}`);

    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await PostImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgPromises);

  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
    postImgPromises,
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

  const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
  const urlProfileUser = await getDownloadURL(imgRefUserProfile);

  post.user.profileImgUrl = urlProfileUser;

  const postImgsPromises = post.postImgs.map(async (postImg) => {
    const imgRef = ref(storage, postImg.postImgUrl);
    const url = await getDownloadURL(imgRef);

    postImg.postImgUrl = url;

    return postImg;
  });

  const userImgsCommentPromises = post.comments.map(async (comment) => {
    const imgRef = ref(storage, comment.user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    comment.user.profileImgUrl = url;

    return comment;
  });

  const arrPromises = [...postImgsPromises, ...userImgsCommentPromises];

  await Promise.all(arrPromises);

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
