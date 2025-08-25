import Post from '../models/Post.js';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const createUser = async (req, res) => {
  const {
    body: { firstName, lastName, email }
  } = req;
  if (!firstName || !lastName || !email)
    throw new Error('firstName, lastName, and email are required');
  const found = await User.findOne({ where: { email } });
  if (found) throw new Error('User with that email already exists');
  const user = await User.create(req.body);
  res.json(user);
};

export const getUserById = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const user = await User.findByPk(id, { include: Post });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const {
    body: { firstName, lastName, email },
    params: { id }
  } = req;
  if (!firstName || !lastName || !email)
    throw new Error('firstName, lastName, and email are required');
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.update(req.body);
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const {
    params: { id }
  } = req;
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
  res.json({ message: 'User deleted' });
};
