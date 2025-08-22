import { Router } from 'express';
import { createPost, deletePost, getPostById, getPosts, updatePost } from '../controllers/post.controller.js';
import validatePostBody from '../middlewares/validatePostBody.js';

const postRouter = Router();

postRouter.route('/').get(getPosts).post(validatePostBody, createPost);
postRouter.route('/:id').get(getPostById).put(validatePostBody, updatePost).delete(deletePost);

export default postRouter;
