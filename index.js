import 'dotenv/config';
import express from 'express';
import { pool } from './src/data/postgresDB.js';
import userRouter from './src/controller/users.js';


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hi everyone')
});

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});