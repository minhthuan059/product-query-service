import { Client } from 'pg';

// Kết nối trực tiếp tới database đích (đã tồn tại)
const connectionString = process.env.DATABASE_URL;
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

async function createTable() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(createTableSQL);
    console.log('Table "products" created (if not existed).');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await client.end();
  }
}

createTable();
