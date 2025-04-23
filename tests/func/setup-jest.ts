import {beforeEach, afterAll} from '@jest/globals';

import pkg from 'pg';
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    /*user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database:  process.env.PG_NAME,
    password:  process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "5432"), */
  });

beforeEach(async () => {
  // Réinitialisation : suppression + recréation des tables
  await pool.query(`TRUNCATE TABLE "user", "budget" RESTART IDENTITY CASCADE;`);

  // Seeding : ajout de données de test
  await pool.query(`
    INSERT INTO "user" (email, last_name, first_name, "password")
VALUES ('martin.fretto@gmail.com', 'Fretto', 'Martin', '$argon2id$v=19$m=65536,t=3,p=4$+C4A2vvar25ppRrrUFyRQw$dNtz7oRLpJuRi4GdQNr8QC2CVF8hCzsQlvhAL0CWAPI');
INSERT INTO "budget" (name, warning_amount, spent_amount, allocated_amount, user_id)
VALUES ('alimentation', 600, 0, 700, 1),
('santé', 100, 0, 150, 1);
  `);
});

afterAll(async () => {
  // Fermeture de la connexion après les tests
  await pool.end();
});