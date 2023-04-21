const express = require('express');
const commentController = require('./../controllers/comment.controller');

const authMiddleware = require('./../middlewares/auth.middleware');
const commentMiddleware = require('./../middlewares/comment.middleware');
const validationsMiddleware = require('./../middlewares/validations.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', commentController.findAllComents);

router.post('/:postId', commentController.createComment);

router
  .use('/:id', commentMiddleware.commentExist)
  .route('/:id')
  .get(commentController.findCommentById)
  .patch(
    validationsMiddleware.validContentComment,
    commentController.updateComment
  )
  .delete(commentController.deleteComment);

module.exports = router;
