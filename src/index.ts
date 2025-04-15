import express from 'express';
import 'dotenv/config';
import { router } from './router';
import helmet from 'helmet';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(router);

app.use(helmet());

app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
})
