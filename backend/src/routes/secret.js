import { Router } from 'express';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import database from '../db/database.js';
import { validateSecretToken } from './unlock.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = file.fieldname === 'media' ? 'media' : 'files';
        cb(null, join(__dirname, '../../uploads', type));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// All routes here are protected
router.use(validateSecretToken);

// Intelligence: Get all contact messages
router.get('/contact-messages', (req, res) => {
    try {
        const messages = database.getContactMessages();
        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Notes: Get all notes
router.get('/notes', (req, res) => {
    try {
        const notes = database.getNotes();
        res.json({ success: true, data: notes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Notes: Create a note
router.post('/notes', (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, error: 'Content required' });
        const result = database.createNote(content);
        res.json({ success: true, id: result.id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Vault: Get all media
router.get('/media', (req, res) => {
    try {
        const media = database.getMedia();
        res.json({ success: true, data: media });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Vault: Upload media
router.post('/media', upload.single('media'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'File required' });

        database.addMedia(
            req.file.filename,
            req.file.originalname,
            `/uploads/media/${req.file.filename}`,
            req.file.mimetype,
            req.file.size
        );

        res.json({ success: true, file: req.file.filename });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Vault: Get all files
router.get('/files', (req, res) => {
    try {
        const files = database.getFiles();
        res.json({ success: true, data: files });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Vault: Upload file
router.post('/files', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'File required' });

        database.addFile(
            req.file.filename,
            req.file.originalname,
            `/uploads/files/${req.file.filename}`,
            req.file.mimetype,
            req.file.size
        );

        res.json({ success: true, file: req.file.filename });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
