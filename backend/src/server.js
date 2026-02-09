import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import experienceRouter from './routes/experience.js';
import contactRouter from './routes/contact.js';
import unlockRouter, { validateSecretToken } from './routes/unlock.js';
import secretRouter from './routes/secret.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

function normalizeOrigin(origin) {
    return origin ? origin.replace(/\/$/, '') : origin;
}

function toOrigin(value) {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    try {
        return normalizeOrigin(new URL(trimmed).origin);
    } catch {
        // Fallback for plain origins like http://localhost:5173 without strict URL parsing
        return normalizeOrigin(trimmed);
    }
}

const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => toOrigin(origin))
    .filter(Boolean);

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (curl, health checks, server-to-server)
        if (!origin) {
            return callback(null, true);
        }

        const normalized = normalizeOrigin(origin);
        if (configuredOrigins.includes(normalized)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-secret-token']
}));
app.use(express.json({ limit: '10kb' }));

// Static serving for uploads (Protected by token in frontend logic, but usually we don't serve secret stuff via basic static middleware if really sensitive, however for this scope it is fine)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/contact', contactRouter);
app.use('/api/unlock', unlockRouter);
app.use('/api/secret', secretRouter);

// Protected secret route
app.get('/api/x', validateSecretToken, (req, res) => {
    res.json({ success: true, message: 'Welcome to the other side.' });
});

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log('Allowed CORS origins:', configuredOrigins.join(', '));
    console.log('API endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/projects');
    console.log('   GET  /api/experience');
    console.log('   POST /api/contact');
});