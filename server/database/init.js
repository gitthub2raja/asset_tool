const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/assets.db');

let db = null;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      }
    });
  }
  return db;
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    // Create users table
    database.serialize(() => {
      database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('admin', 'technician')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          return reject(err);
        }
      });

      // Create assets table
      database.run(`
        CREATE TABLE IF NOT EXISTS assets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          serial_number TEXT UNIQUE,
          manufacturer TEXT,
          model TEXT,
          status TEXT NOT NULL CHECK(status IN ('active', 'inactive', 'maintenance', 'retired')),
          location TEXT,
          assigned_to TEXT,
          purchase_date TEXT,
          warranty_expiry TEXT,
          ip_address TEXT,
          mac_address TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating assets table:', err);
          return reject(err);
        }
      });

      // Create default admin user if not exists
      database.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], async (err, row) => {
        if (err) {
          console.error('Error checking admin users:', err);
          return reject(err);
        }

        if (row.count === 0) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          database.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@assetmanagement.com', hashedPassword, 'admin'],
            (err) => {
              if (err) {
                console.error('Error creating default admin:', err);
                return reject(err);
              }
              console.log('✅ Default admin user created (username: admin, password: admin123)');
            }
          );
        }

        // Create default technician user if not exists
        database.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['technician'], async (err, row) => {
          if (err) {
            console.error('Error checking technician users:', err);
            return reject(err);
          }

          if (row.count === 0) {
            const hashedPassword = await bcrypt.hash('tech123', 10);
            database.run(
              'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
              ['technician', 'tech@assetmanagement.com', hashedPassword, 'technician'],
              (err) => {
                if (err) {
                  console.error('Error creating default technician:', err);
                  return reject(err);
                }
                console.log('✅ Default technician user created (username: technician, password: tech123)');
                resolve();
              }
            );
          } else {
            resolve();
          }
        });
      });
    });
  });
}

function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      }
    });
  }
}

module.exports = {
  getDatabase,
  initializeDatabase,
  closeDatabase
};

