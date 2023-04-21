const express = require('express');

const authMiddleware = require('./../middlewares/auth.middleware');
const postController = require('./../controllers/post.controller');
const validationSMiddleware = require('./../middlewares/validations.middleware');
const userMiddleware = require('./../middlewares/user.middlewares');
const postMiddleware = require('./../middlewares/post.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(validationSMiddleware.createPostValidation, postController.createPost);

router.get('/me', postController.findMyPost);

router.get(
  '/profile/:id',
  userMiddleware.validIfExistUser,
  postController.findUserPost
);

router
  .use('/:id', postMiddleware.validIfExistPost)
  .route('/:id')
  .get(postController.findOnePost)
  .patch(
    authMiddleware.protectAccountOwner,
    validationSMiddleware.validIfupdated,
    postController.updatePost
  )
  .delete(
    authMiddleware.protectAccountOwner,

    postController.deletePost
  );

module.exports = router;
