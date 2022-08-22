const { Router } = require('express');
const postController = require('../post/post-controller');
const authController = require('../user/auth-controller');

const router = Router();

router.get('/get-post/:id', authController.optional, postController.getPost);
router.post('/create-post', authController.authorize, postController.addPost);
router.get('/post-viewers/:id', postController.getPostViewers);
export { router as postRouter };
