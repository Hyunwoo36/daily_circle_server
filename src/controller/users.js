import express from "express";
import { pool } from '../data/postgresDB.js';
const userRouter = express.Router();


/*
* db connection test api
*/
userRouter.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT NOW()'); // This is a simple query to test the connection
        res.json({ currentTime: rows[0].now }); // Send back the current time as a response
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error');
    }
});




export default userRouter;