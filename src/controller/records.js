import express from "express";
import { pool } from '../data/postgresDB.js';
import { admin } from '../auth/firebase.js';


const recordRouter = express.Router();


/*
* middlewares - whenever user do any actions, use this as a middleware
*/
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if no token, unauthorized

    // Verify the token using Firebase Admin SDK
    admin.auth().verifyIdToken(token)
        .then(decodedToken => {
            const uid = decodedToken.uid;
            // Attach UID to the request, so it can be used in your route handler
            req.uid = uid;
            console.log("User verified!");
            next();
        })
        .catch((error) => {
            // Handle error
            console.error('Error verifying auth token', error);
            res.status(403).json({ message: error.message + 'Token is not authorized!' }); // Forbidden
        });
};

/*
* create User's diary
*/
recordRouter.post('/submit', verifyToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const categories = req.body;
        const uid = req.uid;

        for (const category of categories) {
            let small_category;
            let rating;
            for (const activity of category.activities) {
                small_category = activity.name.toLowerCase();
                rating = activity.score;
            }

            const result = await client.query(
                'INSERT INTO "userRecord" (uid, rating, date, small_category) \
                VALUES ($1, $2, CURRENT_DATE, $3)',
                [uid, rating, small_category]
            )
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