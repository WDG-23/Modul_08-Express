import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import { DataTypes, Sequelize, ValidationError } from 'sequelize';

// Sequelize-Instanz: Verbindung zur PostgreSQL-Datenbank
const sequelize = new Sequelize(process.env.PG_URI, { logging: false });

// User Model: Definition der Tabellenstruktur mit Spaltentypen und Validierung
const User = sequelize.define('user', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false, // NOT NULL Constraint
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // UNIQUE Constraint
  },
});

// Note Model: TEXT für längere Inhalte, paranoid für Soft Delete
const Note = sequelize.define(
  'note',
  {
    content: {
      type: DataTypes.TEXT, // Unbegrenzte Textlänge
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(234), // VARCHAR mit Längenbegrenzung
    },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // }
  },
  {
    paranoid: true, // Soft Delete: deletedAt-Spalte statt echtes Löschen
  }
);

//  Assoziationen: 1:n Beziehung zwischen User und Note
// User.hasMany(Note); // User kann viele Notes haben
// Note.belongsTo(User); // Note gehört zu einem User (erstellt automatisch userId foreign key)

// Assoziationen: n:n Beziehung über Verknüpfungstabelle UserNotes
// erstellt automatisch userId und noteId
const UsersNotes = sequelize.define('UsersNotes');
User.belongsToMany(Note, { through: 'UsersNotes' });
Note.belongsToMany(User, { through: 'UsersNotes' });

// Sync: Erstellt Tabellen basierend auf Modell-Definitionen
sequelize.sync();

const app = express();
const port = process.env.PORT || 3456;

app.use(express.json(), cors());

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate(); // Datenbankverbindung testen
    res.json({ msg: 'Server healthy' });
  } catch {
    res.status(500);
  }
});

//
// Users
//

app.post('/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    // Model.create(): Erstellt neuen Datensatz
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json({ data: user });
  } catch (error) {
    // ValidationError: Sequelize-spezifische Validierungsfehler abfangen
    if (error instanceof ValidationError) {
      res.status(400).json({ msg: error.errors[0].message });
      return;
    }
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    // Model.findAll(): Alle Datensätze abrufen
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users/:id', async (req, res) => {
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
});

app.put('/users/:id', async (req, res) => {
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
});

app.delete('/users/:id', async (req, res) => {
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
});

//
// NOTES
//

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
