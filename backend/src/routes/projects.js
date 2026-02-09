import { Router } from 'express';
import database from '../db/database.js';

const router = Router();

// GET /api/projects - Fetch all projects
router.get('/', async (req, res) => {
    try {
        await database.ready();
        const projects = database.getProjects();
        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects'
        });
    }
});

export default router;
