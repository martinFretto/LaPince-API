import express from 'express';
import 'dotenv/config';
import { router } from './src/router';
import helmet from 'helmet';
import { notFound } from './src/middlewares/notFound';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: "*", // à restreindre en prod !
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use
app.use(helmet());
app.use(express.json());
app.use(router);

app.use(notFound);

app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
})
