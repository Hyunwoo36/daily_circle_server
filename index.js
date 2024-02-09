import 'dotenv/config';
import express from 'express';

import userRouter from './src/controller/users.js';
import recordRouter from './src/controller/records.js';
import authRouter from './src/auth/authorization.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for html form post request

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hi everyone')
});

app.use('/users', userRouter);
app.use('/record', recordRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});