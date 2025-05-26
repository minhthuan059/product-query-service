
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../errors/notFound.js";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

//Get all products
const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

// Create
const createProduct = async (id, name, price) => {
  await pool.query('INSERT INTO products (id, name, price) VALUES ($1, $2, $3)', [id, name, price]);
};

// Update
const updateProduct = async (id, name, price) => {
  const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (product.rows.length === 0) {
    throw new NotFoundError(`Product with ID ${id} does not exist or has been deleted.`);
  }
  await pool.query('UPDATE products SET name = $1, price = $2 WHERE id = $3', [name, price, id]);
};

// Delete
const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);  
};

export const handlers = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
};
