import { User, Post } from '../models/index.js';

// Mit globalem Error Handler können wir auf try-catch in den Controllern verzichten
// und sogar explizit neue Fehler aufwerfen.
const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const createUser = async (req, res) => {
  const {
    body: { firstName, lastName, email },
  } = req;
  if (!firstName || !lastName || !email)
    return res.status(400).json({ error: 'firstName, lastName, and email are required' });
  const found = await User.findOne({ where: { email } });
  if (found) throw new Error('User already exists', { cause: 409 });
  const user = await User.create(req.body);
  res.json(user);
};

const getUserById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findByPk(id, { include: Post });
  if (!user) throw new Error('User not found', { cause: 404 });
  res.json(user);
};

const updateUser = async (req, res) => {
  const {
    params: { id },
  } = req;

  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found', { cause: 404 });
  await user.update(req.body);
  res.json(user);
};

const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found', { cause: 404 });
  await user.destroy();
  res.json({ message: 'User deleted' });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
