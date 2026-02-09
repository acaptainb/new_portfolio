import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import database from '../db/database.js';

const router = Router();

// Rate limiter: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        error: 'Too many submissions. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - Submit contact form
router.post('/', contactLimiter, async (req, res) => {
    try {
        await database.ready();

        const { name, email, message, website } = req.body;

        // Honeypot check - if 'website' field is filled, it's a bot
        if (website) {
            // Pretend success to fool bots
            return res.json({ success: true, message: 'Message sent successfully!' });
        }

        // Validation
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid name (at least 2 characters)'
            });
        }

        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a message (at least 10 characters)'
            });
        }

        // Sanitize and limit input lengths
        const sanitizedName = name.trim().slice(0, 100);
        const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);
        const sanitizedMessage = message.trim().slice(0, 5000);

        // Get IP address
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

        // Save to database
        database.createContactMessage(
            sanitizedName,
            sanitizedEmail,
            sanitizedMessage,
            ipAddress
        );

        res.json({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again.'
        });
    }
});

export default router;
