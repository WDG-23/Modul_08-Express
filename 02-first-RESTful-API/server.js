import express from 'express';
import chalk from 'chalk';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  const { rows } = await query('SELECT NOW();');
  res.json({ msg: 'Product API is live', time: rows[0] });
});

//  Create, Read, Update, Delete
//  POST,   GET,   PUT,    DELETE

app.post('/products', async (req, res) => {
  const { name, image, description, category, price, stock } = req.body;
  if (!name || !price) {
    res.status(400).json({ msg: 'Name and price a required' });
  }

  try {
    const { rows } = await query(
      'INSERT INTO products (name, image, description, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [name, image, description, category, price, stock]
    );
    res.status(201).json({ msg: 'POST', data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const { rows } = await query('select * from products;');
    res.json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await query('select * from products where id = $1;', [id]);

    if (!rowCount) {
      res.status(404).json({ msg: `Product with id ${id} not found` });
      return;
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, description, category, price, stock } = req.body;

  try {
    const { rows, rowCount } = await query(
      `
      update products
      set
        name = $1,
        image = $2,
        description = $3,
        category = $4,
        price = $5,
        stock = $6
      where id = $7
      returning * 
      `,
      [name, image, description, category, price, stock, id]
    );

    if (!rowCount) {
      res.status(404).json({ msg: `Product with id ${id} not found` });
      return;
    }

    res.json({ msg: `Updated product id ${id}`, data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await query('delete from products where id = $1 returning *;', [id]);

    if (!rowCount) {
      res.status(404).json({ msg: `Product with id ${id} not found` });
      return;
    }

    res.json({ msg: 'Deletion successful', data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(chalk.green(`Server läuf auf port ${port}`));
});
