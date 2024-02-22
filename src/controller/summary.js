import express from "express";
import { pool } from '../data/postgresDB.js';
const summaryRouter = express.Router();

summaryRouter.get('/summary-weekly', async (req, res) => {
    const { uid } = req.params;

    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT uid, 
                    small_category, 
                    DATE_TRUNC('week', date) AS week_start_date,
                    AVG(rating) AS weekly_average
            FROM "userRecord"
            WHERE uid = $1
            GROUP BY uid, small_category, week_start_date
            ORDER BY week_start_date DESC`,
            [uid]
        );

        const weeklyAverages = result.rows;
        res.status(200).json(weeklyAverages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
});

export default recordRouter;