import chalk from 'chalk';
import cors from 'cors';
import express from 'express';

// TODO: Sequelize

// TODO: User Model

// TODO: Note Model

const app = express();
const port = process.env.PORT || 3456;

app.use(express.json(), cors());

app.get('/', (req, res) => {
  res.json({ msg: 'Server healthy' });
});

app.post('/users', async (req, res) => {
  //
  try {
    const user = 'CREATE USER';
    res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    //
    const users = 'GET ALL USERS';
    //
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users/:id', async (req, res) => {
  //
  try {
    //
    const user = 'GET USER BY ID';
    //
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  //
  try {
    //
    const user = 'UPDATE USER BY ID';
    //
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  //
  try {
    //
    const rowCount = 'DELETE USER BY ID';
    //

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
    //
    const data = 'GET ALL NOTES';
    //
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/notes', async (req, res) => {
  //
  try {
    //
    const note = 'CREATE NOTE';
    //

    res.status(201).json({ data: note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/notes/:id', async (req, res) => {
  //
  try {
    //
    const data = 'GET NOTE BY ID';
    //
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
  //
  try {
    const [rowCount, notes] = [1, 'UPDATE NOT BY ID'];
    if (!rowCount) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.json({ data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  //
  try {
    const rowCount = 'DELETE NOTE BY ID';
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
