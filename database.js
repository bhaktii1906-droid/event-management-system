
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Create SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'eventease.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create tables
  db.serialize(() => {
    // Admins table
    db.run(`CREATE TABLE IF NOT EXISTS Admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      registration_date DATE NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Events table
    db.run(`CREATE TABLE IF NOT EXISTS Events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT,
      capacity INTEGER NOT NULL,
      booked_seats INTEGER DEFAULT 0,
      amenities TEXT,
      status TEXT DEFAULT 'upcoming',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS Bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      booking_date DATE NOT NULL,
      number_of_seats INTEGER NOT NULL,
      status TEXT DEFAULT 'confirmed',
      attendee_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (event_id) REFERENCES Events(id)
    )`);

    // Enquiries table
    db.run(`CREATE TABLE IF NOT EXISTS Enquiries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      date DATE NOT NULL,
      admin_reply TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (event_id) REFERENCES Events(id)
    )`);

    // Insert default data
    insertDefaultData();
  });
}

async function insertDefaultData() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // Insert admin
  db.run(`INSERT OR IGNORE INTO Admins (id, name, email, password) VALUES (?, ?, ?, ?)`, 
    ['admin_001', 'Admin User', 'admin@example.com', adminPassword]);

  // Insert users
  db.run(`INSERT OR IGNORE INTO Users (id, name, email, mobile, password, registration_date) VALUES (?, ?, ?, ?, ?, ?)`, 
    ['user_001', 'John Doe', 'user@example.com', '9876543210', userPassword, '2025-01-15']);

  // Insert events
  db.run(`INSERT OR IGNORE INTO Events (id, title, description, date, time, end_time, type, location, image, capacity, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    ['event_001', 'Tech Conference 2025', 'Annual technology conference', '2025-12-15', '09:00', '18:00', 'Conference', 'New Delhi', 'https://images.unsplash.com/photo-1552664730-d307ca884978', 500, 'WiFi, Catering']);

  console.log('Database initialized with default data');
}

module.exports = db;



