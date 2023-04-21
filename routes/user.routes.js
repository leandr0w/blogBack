const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('./../middlewares/auth.middleware');
const userMiddleware = require('./../middlewares/user.middlewares');
const validationMiddleware = require('./../middlewares/validations.middleware');
const authController = require('./../controllers/auth.controller');

router.use(authMiddleware.protect);

router.get('/', userController.findAll);

router
  .route('/:id')
  .get(userMiddleware.validIfExistUser, userController.findOne)
  .patch(
    userMiddleware.validIfExistUser,
    validationMiddleware.updateUserValidation,
    authMiddleware.protectAccountOwner,
    userController.update
  )
  .delete(
    userMiddleware.validIfExistUser,
    authMiddleware.restrictTo('admin', 'root'),
    userController.delete
  );

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validIfExistUser,
  authMiddleware.protectAccountOwner,
  authController.updatePassword
);

module.exports = router;
