import { afterAll} from '@jest/globals';

import pkg from 'pg';
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config({ path: '.env.test' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

afterAll(async () => {
  await pool.end();
});