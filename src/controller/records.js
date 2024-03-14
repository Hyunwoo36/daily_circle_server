import express from "express";
import { pool } from '../data/postgresDB.js';

import verifyToken from "../middleware/tokenAuth.js";

const recordRouter = express.Router();

/*
* create User's diary
*/
recordRouter.post('/submit', verifyToken, async (req, res) => {

    // check the date and if the sent date is today's date, 
    const uid = req.uid;
    const { date, categories } = req.body;
    console.log('categories:', categories);
    const submittedDate = new Date(date);
    const today = new Date();

    // Check if the dates match, reject if from past or future
    if (submittedDate.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)) {
        return res.status(400).json({ message: "You can only submit records for today!" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const category of categories) {
            let small_category;
            let rating;
            for (const activity of category.activities) {
                small_category = activity.name.toLowerCase();
                rating = activity.score;

                // Check if records for the user and date already exist
                const updateResult = await client.query(
                    `UPDATE "userRecord"
                     SET rating = $2
                     WHERE uid = $1 AND small_category = $3 AND DATE(date) = CURRENT_DATE
                     RETURNING *`,
                    [uid, rating, small_category]
                );

                // If no record was updated (i.e., it did not exist), insert a new one
                if (updateResult.rowCount === 0) {
                    await client.query(
                        'INSERT INTO "userRecord" (uid, rating, date, small_category) \
                        VALUES ($1, $2, CURRENT_DATE, $3)',
                        [uid, rating, small_category]
                    );
                }
            }

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
// recordRouter.put('/edit', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');
//         const { uid, dateToEdit, sleeping, eating, workout, coding, reading, academic, friends, family, romance } = req.body;

//         const activities = [
//             { category: 'Sleeping', rating: sleeping },
//             { category: 'Eating', rating: eating },
//             { category: 'Workout', rating: workout },
//             { category: 'Coding', rating: coding },
//             { category: 'Reading', rating: reading },
//             { category: 'Academic', rating: academic },
//             { category: 'Friends', rating: friends },
//             { category: 'Family', rating: family },
//             { category: 'Romance', rating: romance },
//         ];

//         for (const activity of activities) {
//             const result = await client.query(
//                 `UPDATE "userRecord"
//                 SET rating = $2
//                 WHERE uid = $1 AND small_category = $3 AND DATE(date) = $4`,
//                 [uid, activity.rating, activity.category, dateToEdit]
//             );
//             // result.rows contains the rows returned by the query
//         }
//         await client.query('COMMIT');
//         res.status(201).json({ message: 'Records edited successfully' });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         res.status(500).json({ message: error.message });

//     } finally {
//         client.release();
//     }


// });

/*
* delete user's diary
*/
recordRouter.delete('/delete', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { uid, dateToDelete } = req.body;

        // Delete records for the specified UID and date
        const result = await client.query(
            `DELETE FROM "userRecord"
            WHERE uid = $1 AND DATE(date) = $2`,
            [uid, dateToDelete]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: 'Records deleted successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });

    } finally {
        client.release();
    }
});


export default recordRouter;