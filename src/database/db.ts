import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Nécessaire pour Render
    },
});

db.connect()
    .then(() => console.log("Connexion réussie à PostgreSQL"))
    .catch((err) => console.error("Erreur de connexion à PostgreSQL :", err));




  export {db}
