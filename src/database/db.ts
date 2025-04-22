import {Pool} from 'pg';
import dotenv from "dotenv";

dotenv.config();

// Configuration du pool de connexions
const db = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database:  process.env.PG_NAME,
    password:  process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "5432"), 
    ssl: {

      rejectUnauthorized: false, // Nécessaire pour Render

    },
  });
  
  db.connect()
    .then(() => console.log("Connexion réussie à PostgreSQL"))
    .catch((err) => console.error("Erreur de connexion à PostgreSQL :", err));

  export {db}