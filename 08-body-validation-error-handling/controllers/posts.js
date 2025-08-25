import Post from '../models/Post.js';
import User from '../models/User.js';

export const getPosts = async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.json(posts);
};

export const createPost = async (req, res) => {
  const {
    body: { title, content, userId }
  } = req;
  if (!title || !content || !userId) throw new Error('title, content, and userId are required');
  const post = await Post.create(req.body);
  const user = await post.getUser();
  post.dataValues.user = user;
  res.json(post);
};

export const getPostById = async (req, res) => {
  const {
    params: { id }
  } = req;
  const post = await Post.findByPk(id, { include: User });
  if (!post) throw new Error('Post not found');
  res.json(post);
};

export const updatePost = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;
  if (!title || !content || !userId) throw new Error('title, content, and userId are required');
  const post = await Post.findByPk(id);
  if (!post) throw new Error('Post not found');
  await post.update(req.body);
  const user = await post.getUser();
  post.dataValues.user = user;
  res.json(post);
};

export const deletePost = async (req, res) => {
  const {
    params: { id }
  } = req;
  const post = await Post.findByPk(id);
  if (!post) throw new Error('Post not found');
  await post.destroy();
  res.json({ message: 'Post deleted' });
};
