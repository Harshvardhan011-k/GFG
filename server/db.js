import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {
            // Create tables
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT UNIQUE,
                balance INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                amount INTEGER,
                type TEXT,
                goal_id INTEGER,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (!err) {
                    // Quick migration check: Try to add goal_id column
                    // If it exists, this will fail harmlessly
                    db.run("ALTER TABLE transactions ADD COLUMN goal_id INTEGER", (err) => {
                        if (err && !err.message.includes("duplicate column name")) {
                            console.log("Migration info:", err.message);
                        } else if (!err) {
                            console.log("Migrated transactions table: Added goal_id");
                        }
                    });
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT,
                target_amount INTEGER,
                current_amount INTEGER DEFAULT 0,
                icon TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // Seed default user if not exists (for demo)
            // Phone: 9876543210 (Use this for login)
            const insert = 'INSERT OR IGNORE INTO users (phone, balance) VALUES (?, ?)';
            db.run(insert, ['9876543210', 0]);
        });
    }
});

export default db;
