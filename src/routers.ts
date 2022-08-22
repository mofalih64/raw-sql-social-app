import { Router } from 'express';
import userRouter from './apps/user/user-router';
import { postRouter } from './apps/post/post-router';
const router = Router();

router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;
