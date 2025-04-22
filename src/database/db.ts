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
  });
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Nécessaire pour Render
    },
  });
  
  export {db,pool}