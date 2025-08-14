import express from 'express';
import { Pool } from 'pg';

// PostgreSQL Datenbankverbindung erstellen
// Der Connection String wird aus der Umgebungsvariable PG_URI gelesen
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// Express-App initialisieren
const app = express();

// Middleware: JSON-Parser aktivieren
// Ermöglicht es, JSON-Daten im Request Body zu verarbeiten
app.use(express.json());

// Beispiel-Route zum Testen der Datenbankverbindung
app.get('/beispielsweise', async (req, res) => {
  const data = await pool.query('SELECT NOW();');
  console.log(data);

  res.status(200).json({ message: 'klappt!' });
});

// CRUD - Create Read Update Delete
// http - POST   GET  PUT    DELETE

// CREATE - Neues Buch erstellen
app.post('/books', async (req, res) => {
  // INSERT INTO posts (title) VALUES ('Brave New World');

  // Titel aus dem Request Body extrahieren (Destructuring)
  const { title } = req.body;

  // SQL-Query mit Platzhalter ($1) für sicheren Parameter-Einsatz
  // Verhindert SQL-Injection-Angriffe
  const data = await pool.query(`INSERT INTO posts (title) VALUES ($1);`, [title]);

  // HTTP Status 201 = "Created" für erfolgreich erstellte Ressource
  res.status(201).json({ message: 'Posted new book: ' + req.body.title, data });
});

// READ - Alle Bücher abrufen
app.get('/books', async (req, res) => {
  // SELECT * FROM posts;

  // Destructuring: Nur die 'rows' aus dem Query-Ergebnis extrahieren
  const { rows } = await pool.query('SELECT * FROM posts;');

  // HTTP Status 200 ist Standard für erfolgreiche GET-Requests
  res.json({ books: rows });
});

// READ - Ein spezifisches Buch abrufen
app.get('/books/:id', async (req, res) => {
  // URL-Parameter (:id) aus der Route extrahieren
  const { id } = req.params;

  // Prepared Statement mit Parameter für sichere Abfrage
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1;', [id]);

  // Erstes (und einziges) Ergebnis zurückgeben
  res.json({ book: rows[0] });
});

// UPDATE - Ein Buch aktualisieren
app.put('/books/:id', async (req, res) => {
  // Daten aus Request Body und URL-Parameter extrahieren
  const { title } = req.body;
  const { id } = req.params;

  // UPDATE-Query mit zwei Parametern ($1 = title, $2 = id)
  const { rowCount } = await pool.query(
    `
    UPDATE posts
      SET title = $1
    WHERE id = $2;
    `,
    [title, id]
  );

  // Prüfen ob ein Datensatz aktualisiert wurde
  // rowCount = 0 bedeutet: Buch mit dieser ID existiert nicht
  if (rowCount === 0) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  // HTTP Status 204 = "No Content" für erfolgreiches Update ohne Rückgabe
  res.status(204).json({ message: 'Book updated: ' + id });
});

// DELETE - Ein Buch löschen
app.delete('/books/:id', async (req, res) => {
  // DELETE FROM posts WHERE id = 1;

  // ID aus URL-Parameter extrahieren
  const { id } = req.params;

  // DELETE-Query mit Parameter
  const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1;', [id]);

  // Prüfen ob ein Datensatz gelöscht wurde
  if (rowCount === 0) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  // HTTP Status 204 = "No Content" für erfolgreiches Löschen
  res.status(204).json({ message: 'Book deleted: ' + id });
});

// Server auf Port 3000 starten
app.listen(3000, () => console.log(` Server läuft auf port 3000 `));
