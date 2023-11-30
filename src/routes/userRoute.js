import express from 'express';
import authController from '../controllers/auth.controller.js'
import { asyncError } from '../middlewares/err.handler.js';
import { isAuthenticated } from '../middlewares/auth.middlewares.js';
import { singleUpload } from '../middlewares/multer.js';
const router = express.Router();

router.post('/signup', singleUpload, asyncError(authController.Register));
router.post('/login', asyncError(authController.Login));
router.get('/profile', isAuthenticated,asyncError(authController.Profile));
router.get('/logout', isAuthenticated,asyncError(authController.Logout));

//@desc Updating routes
router.put('/updateProfile', isAuthenticated, asyncError(authController.UpdateProfile));
router.put('/updatePassword', isAuthenticated,asyncError(authController.UpdatePassword));
router.put('/updatePic',  isAuthenticated, singleUpload, asyncError(authController.UpdatePic));

//Forget and Reset Password
router.route('/forget-password').post(asyncError(authController.ForgetPassword))
// router.route('/reset-password/:token').patch(asyncError(authController.ResetPassword));
router.route('/reset-password').patch(asyncError(authController.ResetPassword));


export default router;