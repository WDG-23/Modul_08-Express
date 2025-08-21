import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import sequelize from './db/index.js';
import noteRouter from './routers/note.router.js';
import userRouter from './routers/user.router.js';

const app = express();
const port = process.env.PORT || 3456;

app.use(express.json(), cors());

app.get('/', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ msg: 'Server healthy' });
  } catch {
    res.status(500);
  }
});

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.listen(port, () => console.log(chalk.bgGreen(` CRUD Operations listening on port ${port}  `)));
