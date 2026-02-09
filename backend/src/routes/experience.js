import { Router } from 'express';
import database from '../db/database.js';

const router = Router();

// GET /api/experience - Fetch all experience items
router.get('/', async (req, res) => {
    try {
        await database.ready();
        const experience = database.getExperience();

        // Group by category for easier frontend consumption
        const grouped = {
            awards: experience.filter(e => e.category === 'award'),
            competitions: experience.filter(e => e.category === 'competition'),
            clubs: experience.filter(e => e.category === 'club')
        };

        res.json({
            success: true,
            data: grouped
        });
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch experience'
        });
    }
});

export default router;
