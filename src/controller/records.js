import express from "express";
import { pool } from '../data/postgresDB.js';
const recordRouter = express.Router();

/*
* create User's diary
*/
recordRouter.post('/submit', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { uid, sleeping, eating, workout, coding, reading, academic, friends, family, romance } = req.body;

        const activities = [
            { category: 'Sleeping', rating: sleeping },
            { category: 'Eating', rating: eating },
            { category: 'Workout', rating: workout },
            { category: 'Coding', rating: coding },
            { category: 'Reading', rating: reading },
            { category: 'Academic', rating: academic },
            { category: 'Friends', rating: friends },
            { category: 'Family', rating: family },
            { category: 'Romance', rating: romance },
        ];

        for (const activity of activities) {
            const result = await client.query(
                'INSERT INTO "userRecord" (uid, rating, date, small_category) \
                VALUES ($1, $2, CURRENT_DATE, $3)',
                [uid, activity.rating, activity.category]
            );
            // result.rows contains the rows returned by the query
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Records added successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
});


/*
* edit user's diary
*/
recordRouter.put('/edit', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { uid, dateToEdit, sleeping, eating, workout, coding, reading, academic, friends, family, romance } = req.body;

        const activities = [
            { category: 'Sleeping', rating: sleeping },
            { category: 'Eating', rating: eating },
            { category: 'Workout', rating: workout },
            { category: 'Coding', rating: coding },
            { category: 'Reading', rating: reading },
            { category: 'Academic', rating: academic },
            { category: 'Friends', rating: friends },
            { category: 'Family', rating: family },
            { category: 'Romance', rating: romance },
        ];

        for (const activity of activities) {
            const result = await client.query(
                `UPDATE "userRecord"
                SET rating = $2
                WHERE uid = $1 AND small_category = $3 AND DATE(date) = $4`,
                [uid, activity.rating, activity.category, dateToEdit]
            );
            // result.rows contains the rows returned by the query
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Records edited successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });

    } finally {
        client.release();
    }


});

export default recordRouter;