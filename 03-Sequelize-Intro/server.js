import chalk from 'chalk';
import express from 'express';
import cors from 'cors';

import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const port = process.env.PORT || 3000;

const sequelize = new Sequelize(process.env.PG_URI);

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
  },
  ingredients: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  time: {
    type: DataTypes.INTEGER,
  },
});

Recipe.sync();

app.use(express.json(), cors());

app.post('/recipes', async (req, res) => {
  const { title, ingredients, description, time } = req.body;
  try {
    const recipe = await Recipe.create({ title, ingredients, description, time });
    res.status(201).json({ data: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json({ data: recipes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      res.status(404).json({ msg: 'Recipe not found' });
      return;
    }

    res.json({ data: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, description, time } = req.body;
  try {
    const [rowCount, recipe] = await Recipe.update(
      { title, ingredients, description, time },
      { where: { id }, returning: true }
    );

    if (rowCount !== 1) {
      res.status(404).json({ msg: 'Recipe not found' });
      return;
    }

    res.json({ msg: 'Recipe updated', data: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rowCount = await Recipe.destroy({ where: { id } });

    if (rowCount !== 1) {
      res.status(404).json({ msg: 'Recipe not found' });
      return;
    }

    res.status(204).json({ msg: 'Recipe deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.listen(port, () => console.log(chalk.bgGreen(` Sequelize Intro server läuft auf port ${port} `)));
