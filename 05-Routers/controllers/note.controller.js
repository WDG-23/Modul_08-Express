import { Note, UsersNotes, User } from '../models/index.js';

const createNote = async (req, res) => {
  const { content, userId } = req.body;
  try {
    const note = await Note.create({ content });
    await UsersNotes.create({ userId, noteId: note.id });

    res.status(201).json({ data: note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
const getAllNotes = async (req, res) => {
  try {
    const data = await Note.findAll();
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getOneNote = async (req, res) => {
  const { id } = req.params;
  try {
    // Include User: Lädt assoziierte User-Daten mit (Eager Loading)
    const data = await Note.findByPk(id, { include: User });
    if (!data) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    // Instance-Update: Direkter Zugriff auf Model-Instanz
    note.content = content;
    await note.save(); // Speichert Änderungen in DB

    // Alternative: Bulk-Update (auskommentiert)
    // const [rowCount, notes] = await Note.update({ content }, { returning: true });

    res.json({ data: note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    // Soft Delete bei paranoid:true - setzt nur deletedAt
    const rowCount = await Note.destroy({ where: { id } });
    if (!rowCount) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.status(204).json({ msg: 'Note deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
const addUserToNote = async (req, res) => {
  const { noteId, userId } = req.params;
  try {
    const assoziation = await UsersNotes.create({ userId, noteId });

    res.json({ data: assoziation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export { createNote, getAllNotes, getOneNote, updateNote, deleteNote, addUserToNote };
