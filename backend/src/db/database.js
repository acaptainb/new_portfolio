import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'portfolio.db');

let db;

// Initialize database
async function initDb() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Run schema
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.run(schema);

  // Save to file
  saveDb();

  return db;
}

// Save database to file
function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

// Wait for initialization
const dbReady = initDb();

// Export query helpers with parameterized queries only
export const database = {
  async ready() {
    await dbReady;
    return db;
  },

  // Get all projects ordered by display_order
  getProjects() {
    const stmt = db.prepare('SELECT id, title, description, tech_stack, link FROM projects ORDER BY display_order ASC, created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Get all experience items grouped by category
  getExperience() {
    const stmt = db.prepare('SELECT id, title, description, category, date FROM experience ORDER BY display_order ASC, created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Insert a contact message
  createContactMessage(name, email, message, ipAddress) {
    db.run('INSERT INTO contact_messages (name, email, message, ip_address) VALUES (?, ?, ?, ?)',
      [name, email, message, ipAddress]);
    saveDb();
    return { changes: db.getRowsModified() };
  },

  // Insert a project (for seeding)
  createProject(title, description, techStack, link, displayOrder) {
    db.run('INSERT INTO projects (title, description, tech_stack, link, display_order) VALUES (?, ?, ?, ?, ?)',
      [title, description, techStack, link, displayOrder]);
    saveDb();
    return { changes: db.getRowsModified() };
  },

  // Insert an experience item (for seeding)
  createExperience(title, description, category, date, displayOrder) {
    db.run('INSERT INTO experience (title, description, category, date, display_order) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, date, displayOrder]);
    saveDb();
    return { changes: db.getRowsModified() };
  },

  // Intelligence: Get all contact messages
  getContactMessages() {
    const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Notes: Get all notes
  getNotes() {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Notes: Create a note
  createNote(content) {
    db.run('INSERT INTO notes (content) VALUES (?)', [content]);
    saveDb();
    return { id: db.prepare('SELECT last_insert_rowid() as id').get().id };
  },

  // Vault: Get all media
  getMedia() {
    const stmt = db.prepare('SELECT * FROM media ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Vault: Record media upload
  addMedia(filename, originalName, path, mimeType, size) {
    db.run('INSERT INTO media (filename, original_name, path, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalName, path, mimeType, size]);
    saveDb();
    return { success: true };
  },

  // Vault: Get all files
  getFiles() {
    const stmt = db.prepare('SELECT * FROM files ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Vault: Record file upload
  addFile(filename, originalName, path, mimeType, size) {
    db.run('INSERT INTO files (filename, original_name, path, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalName, path, mimeType, size]);
    saveDb();
    return { success: true };
  },

  // Check if tables have data
  hasData() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM projects');
    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();
    return result.count > 0;
  }
};

export default database;
