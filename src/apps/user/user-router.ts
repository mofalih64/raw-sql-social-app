import { Router } from 'express';
import * as authController from './auth-controller';
import * as userController from './user-controller';

const userRouter = Router();

userRouter.route('/signup').post(userController.signUp);
userRouter.route('/signin').post(userController.signIn);
userRouter.get(
  '/user-posts',
  authController.authorize,
  userController.getUserPosts
);
userRouter.get(
  '/posts-user-saw',
  authController.authorize,
  userController.getPostsUserSaw
);

export default userRouter;
