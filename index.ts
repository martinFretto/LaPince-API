import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import cookieParser from 'cookie-parser';
import { notFound } from './src/middlewares/notFound';
import { router } from './src/router';


const PORT = process.env.PORT || 3000;
const app = express();


app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, // Autorise l'envoi de cookies
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.use(notFound);

app.listen(PORT, () =>{
    console.log("🚀 API démarrée sur http://localhost:3000");
 //   console.log("📄 Swagger UI disponible sur https://projet-la-pince-back-1.onrender.com/api-docs");
    console.log('Swagger docs at http://localhost:3000/api-docs');
});

