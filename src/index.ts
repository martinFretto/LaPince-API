import express from 'express';
import 'dotenv/config';
import { router } from './router';
import helmet from 'helmet';
import { notFound } from './middlewares/notFound';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(router);

app.use(notFound);



app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
})
