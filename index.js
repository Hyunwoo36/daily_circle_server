import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRouter from './src/controller/users.js';
import recordRouter from './src/controller/records.js';
import summaryRouter from './src/controller/summary.js';
import authRouter from './src/auth/authorization.js';


const app = express();
app.use(cors()); // allow all origins and methods

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for html form post request

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.send('Hi everyone')
});

app.use('/users', userRouter);
app.use('/record', recordRouter);
app.use('/summary', summaryRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});