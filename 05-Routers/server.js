import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import { ValidationError } from 'sequelize';
import sequelize from './db/index.js';
import { Note, User, UsersNotes } from './models/index.js';
import userRouter from './routers/user.router.js';

const app = express();
const port = process.env.PORT || 3456;

app.use(express.json(), cors());

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ msg: 'Server healthy' });
  } catch {
    res.status(500);
  }
});

// Users
app.use('/users', userRouter);
// NOTES
// app.use('/notes', noteRouter);

app.get('/notes', async (req, res) => {
  try {
    const data = await Note.findAll();
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/notes', async (req, res) => {
  const { content, userId } = req.body;
  try {
    // Foreign Key wird automatisch durch belongsTo-Assoziation gesetzt
    // const note = await Note.create({ content, userId });

    // Bei n:n Beziehung erstellen wir erst die Notiz, dann den Eintrag in der Verknüpfungstabelle
    const note = await Note.create({ content });
    await UsersNotes.create({ userId, noteId: note.id });

    res.status(201).json({ data: note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/notes/:id', async (req, res) => {
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
});

app.put('/notes/:id', async (req, res) => {
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
});

// Spezieller Endpunkt, um weiteren Nutzer mit einer Notiz zu verknüpfen
// update und delete Endpunkte wären ebenso nötig
app.put('/notes/:noteId/users/:userId', async (req, res) => {
  const { noteId, userId } = req.params;
  try {
    const assoziation = await UsersNotes.create({ userId, noteId });

    res.json({ data: assoziation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
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
});

app.listen(port, () => console.log(chalk.bgGreen(` CRUD Operations listening on port ${port}  `)));
