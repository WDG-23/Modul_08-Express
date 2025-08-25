import { Router } from 'express';
import { createPost, deletePost, getPostById, getPosts, updatePost } from '../controllers/posts.js';
import validate from '../middlewares/validate.js';
import { postSchema } from '../schemas/post.schemas.js';

const postRouter = Router();

postRouter.route('/').get(getPosts).post(validate(postSchema), createPost);
postRouter.route('/:id').get(getPostById).put(validate(postSchema), updatePost).delete(deletePost);

export default postRouter;
