import { ValidationError } from 'sequelize';
import { User, Note } from '../models/index.js';

const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json({ data: user });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ msg: error.errors[0].message });
      return;
    }
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    // findByPk(): Suche nach Primary Key mit include für Assoziationen
    const user = await User.findByPk(id, { include: Note });
    if (!user) {
      res.status(404).json({ msg: 'Cannot find user' });
      return;
    }

    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    // Model.update(): Bulk-Update mit where-Clause, returning gibt geupdateten Datensatz wieder
    const [rowCount, users] = await User.update({ firstName, lastName, email }, { where: { id }, returning: true });

    if (!rowCount) {
      res.status(404).json({ msg: 'Cannot find user' });
      return;
    }
    res.json({ data: users[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Model.destroy(): Löscht Datensätze, gibt Anzahl gelöschter Zeilen zurück
    const rowCount = await User.destroy({ where: { id } });
    if (!rowCount) {
      res.status(404).json({ msg: 'Cannot find user' });
      return;
    }

    res.status(204).json({ msg: 'User deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export { createUser, getAllUsers, getOneUser, updateUser, deleteUser };
