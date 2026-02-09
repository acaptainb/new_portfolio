import { Router } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

const router = Router();

// In-memory token store
// key: token, value: { expires: timestamp }
const tokenStore = new Map();

// Token expiration: 60 minutes (Testing)
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// Rate limiter for unlock attempts: 100 per 15 minutes (Testing)
const unlockLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Middleware to validate secret token
export const validateSecretToken = (req, res, next) => {
    const token = req.headers['x-secret-token'];

    if (!token || !tokenStore.has(token)) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }

    const tokenData = tokenStore.get(token);
    if (Date.now() > tokenData.expires) {
        tokenStore.delete(token);
        return res.status(404).json({ success: false, error: 'Not found' });
    }

    next();
};

// POST /api/unlock - Check knowledge trigger and issue token
router.post('/', unlockLimiter, (req, res) => {
    const { name, email, message } = req.body;

    // Knowledge trigger check
    const isMatch =
        name === 'Admin' &&
        email === 'secret@unlock.com' &&
        message === 'Open Sesame';

    if (!isMatch) {
        // Return generic error to avoid revealing trigger
        return res.status(400).json({ success: false, error: 'Invalid submission' });
    }

    // Generate cryptographically random token
    const token = crypto.randomBytes(32).toString('hex');

    // Store token with expiration
    tokenStore.set(token, { expires: Date.now() + TOKEN_EXPIRY_MS });

    // Cleanup expired tokens occasionally
    if (tokenStore.size > 100) {
        const now = Date.now();
        for (const [t, data] of tokenStore.entries()) {
            if (now > data.expires) tokenStore.delete(t);
        }
    }

    res.json({ success: true, token });
});

export default router;
