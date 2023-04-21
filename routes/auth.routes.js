const authController = require('../controllers/auth.controller');

const express = require('express');

//middlewares
const validation = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');
const { upload } = require('./../utils/multer');

const router = express.Router();

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validation.createUserValidation,
  authController.signup
);

router.post('/login', validation.loginUserValidation, authController.login);

router.use(authMiddleware.protect);

router.get('/renew', authController.renew);

module.exports = router;
