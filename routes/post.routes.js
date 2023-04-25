const express = require('express');

const authMiddleware = require('./../middlewares/auth.middleware');
const postController = require('./../controllers/post.controller');
const validationSMiddleware = require('./../middlewares/validations.middleware');
const userMiddleware = require('./../middlewares/user.middlewares');
const postMiddleware = require('./../middlewares/post.middleware');

const { upload } = require('./../utils/multer');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(
    upload.array('postImgs', 3),
    validationSMiddleware.createPostValidation,
    postController.createPost
  );

router.get('/me', postController.findMyPost);

router.get(
  '/profile/:id',
  userMiddleware.validIfExistUser,
  postController.findUserPost
);

router

  .route('/:id')
  .get(postMiddleware.existsPostForFoundIt, postController.findOnePost)
  .patch(
    validationSMiddleware.createPostValidation,
    authMiddleware.protectAccountOwner,
    validationSMiddleware.validIfupdated,
    postController.updatePost
  )
  .delete(
    postMiddleware.validIfExistPost,
    authMiddleware.protectAccountOwner,

    postController.deletePost
  );

module.exports = router;
