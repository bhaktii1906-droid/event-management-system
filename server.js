const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// JWT Secret
const JWT_SECRET = 'eventeaseweb_secret_key_2025_change_in_production';

// Database setup
let db;

// Initialize database
const initDatabase = () => {
  db = new sqlite3.Database('./eventease.db', (err) => {
    if (err) {
      console.error('Database error:', err.message);
      return;
    }
    
    console.log('✅ Connected to SQLite database');
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Create tables in correct order to avoid foreign key issues
    db.serialize(() => {
      // Drop existing tables in reverse order
      db.run('DROP TABLE IF EXISTS Notifications');
      db.run('DROP TABLE IF EXISTS Enquiries');
      db.run('DROP TABLE IF EXISTS Bookings');
      db.run('DROP TABLE IF EXISTS Events');
      db.run('DROP TABLE IF EXISTS Users');
      db.run('DROP TABLE IF EXISTS Admins');
      
      // Create Admins table
      db.run(`CREATE TABLE Admins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Create Users table
      db.run(`CREATE TABLE Users (
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
      
      // Create Events table
      db.run(`CREATE TABLE Events (
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
      
      // Create Bookings table
      db.run(`CREATE TABLE Bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        event_id TEXT NOT NULL,
        event_title TEXT NOT NULL,
        booking_date DATE NOT NULL,
        number_of_seats INTEGER NOT NULL,
        status TEXT DEFAULT 'confirmed',
        attendee_details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
      )`);
      
      // Create Enquiries table
      db.run(`CREATE TABLE Enquiries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        event_id TEXT NOT NULL,
        event_title TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        date DATE DEFAULT CURRENT_DATE,
        admin_reply TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
      )`);
      
      // Create Notifications table
      db.run(`CREATE TABLE Notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )`);
      
      console.log('✅ Database tables created');
      
      // Insert default data
      insertDefaultData();
    });
  });
};

// Insert default data with proper async handling
const insertDefaultData = async () => {
  try {
    // Hash passwords
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);
    
    // Helper function for sequential execution
    const runAsync = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    };
    
    // Insert admin
    await runAsync(
      `INSERT INTO Admins (id, name, email, password) VALUES (?, ?, ?, ?)`,
      ['admin_001', 'Admin User', 'admin@example.com', adminHash]
    );
    console.log('✅ Default admin inserted');
    
    // Insert users
    const users = [
      ['user_001', 'John Doe', 'user@example.com', '9876543210', userHash, '2025-01-15'],
      ['user_002', 'Jane Smith', 'jane@example.com', '9876543211', userHash, '2025-02-20'],
      ['user_003', 'Mike Johnson', 'mike@example.com', '9876543212', userHash, '2025-03-10']
    ];
    
    for (const user of users) {
      await runAsync(
        `INSERT INTO Users (id, name, email, mobile, password, registration_date) VALUES (?, ?, ?, ?, ?, ?)`,
        user
      );
    }
    console.log('✅ Default users inserted');
    
    // Insert events
    const events = [
      ['event_001', 'Tech Conference 2025', 'Annual technology conference featuring keynotes from industry leaders, workshops, and networking sessions.', '2025-12-15', '09:00', '18:00', 'Conference', 'New Delhi Convention Center', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop', 500, 'WiFi, Catering, Parking, Certificate'],
      ['event_002', 'Advanced React Workshop', 'Hands-on workshop on Advanced React patterns, hooks, and state management with real-world projects.', '2025-12-20', '10:00', '17:00', 'Workshop', 'Bangalore Tech Hub', 'https://images.unsplash.com/photo-1516534775068-bb57b194b406?w=800&h=500&fit=crop', 80, 'WiFi, Lunch, Materials, Certificate'],
      ['event_003', 'Music Festival 2025', 'Three-day music festival featuring international and local artists across multiple genres.', '2025-12-22', '16:00', '23:00', 'Concert', 'Mumbai Marine Drive', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop', 2000, 'Parking, Catering, VIP Lounge, Security']
    ];
    
    for (const event of events) {
      await runAsync(
        `INSERT INTO Events (id, title, description, date, time, end_time, type, location, image, capacity, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        event
      );
    }
    console.log('✅ Sample events inserted');
    
    // Insert sample bookings
    await runAsync(
      `INSERT INTO Bookings (id, user_id, event_id, event_title, booking_date, number_of_seats, attendee_details) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['booking_001', 'user_001', 'event_001', 'Tech Conference 2025', '2025-01-10', 2, 
       JSON.stringify([{ name: 'John Doe', email: 'user@example.com' }, { name: 'Jane Doe', email: 'jane.doe@example.com' }])]
    );
    
    // Insert sample enquiries
    await runAsync(
      `INSERT INTO Enquiries (id, user_id, user_name, user_email, event_id, event_title, message, status, admin_reply) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['enquiry_001', 'user_001', 'John Doe', 'user@example.com', 'event_001', 'Tech Conference 2025', 
       'What is the dress code for the event?', 'replied', 'Business casual is recommended.']
    );
    
    // Insert sample notifications
    await runAsync(
      `INSERT INTO Notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)`,
      ['notif_001', 'user_001', 'Welcome to EventEaseWeb!', 'Thank you for registering. Start exploring events now.']
    );
    
    console.log('✅ Sample data inserted');
    
  } catch (error) {
    console.error('❌ Error inserting default data:', error.message);
  }
};

// Initialize database on startup
initDatabase();

// Database helper functions
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: 'SQLite',
    time: new Date().toISOString()
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Check if user exists
    const existingUser = await dbGet('SELECT id FROM Users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;
    const registrationDate = new Date().toISOString().split('T')[0];

    await dbRun(
      'INSERT INTO Users (id, name, email, mobile, password, registration_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, mobile, hashedPassword, registrationDate]
    );

    res.status(201).json({ 
      message: 'Registration successful', 
      user: { id: userId, name, email, role: 'user' } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user
    const user = await dbGet('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      token, 
      user: userWithoutPassword,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check admin
    const admin = await dbGet('SELECT * FROM Admins WHERE email = ?', [email]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      message: 'Admin login successful' 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, mobile, registration_date, status FROM Users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    await dbRun('UPDATE Users SET name = ?, mobile = ? WHERE id = ?', [name, mobile, req.user.id]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
app.put('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await dbGet('SELECT password FROM Users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ==================== EVENT ROUTES ====================

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await dbAll('SELECT * FROM Events ORDER BY date ASC');
    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await dbGet('SELECT * FROM Events WHERE id = ?', [id]);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Get upcoming events
app.get('/api/events/upcoming', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const events = await dbAll(
      'SELECT * FROM Events WHERE date >= ? AND status = ? ORDER BY date ASC LIMIT 6',
      [today, 'upcoming']
    );
    res.json({ events });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

// ==================== BOOKING ROUTES ====================

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { eventId, numberOfSeats, attendeeDetails } = req.body;
    const userId = req.user.id;

    // Check event availability
    const event = await dbGet(
      'SELECT capacity, booked_seats, title FROM Events WHERE id = ?',
      [eventId]
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const availableSeats = event.capacity - event.booked_seats;
    
    if (availableSeats < numberOfSeats) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Create booking
    const bookingId = `booking_${Date.now()}`;
    
    await dbRun(
      `INSERT INTO Bookings (id, user_id, event_id, event_title, booking_date, 
       number_of_seats, attendee_details) 
       VALUES (?, ?, ?, ?, DATE('now'), ?, ?)`,
      [bookingId, userId, eventId, event.title, numberOfSeats, 
       JSON.stringify(attendeeDetails || [])]
    );

    // Update event booked seats
    await dbRun(
      'UPDATE Events SET booked_seats = booked_seats + ? WHERE id = ?',
      [numberOfSeats, eventId]
    );

    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId 
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
app.get('/api/bookings/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await dbAll(
      `SELECT b.*, e.date as event_date, e.time as event_time, e.end_time as event_end_time,
       e.location as event_location, e.image as event_image
       FROM Bookings b
       JOIN Events e ON b.event_id = e.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [req.user.id]
    );
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await dbGet(
      `SELECT b.*, e.date as event_date, e.time as event_time, e.end_time as event_end_time,
       e.location as event_location, e.image as event_image
       FROM Bookings b
       JOIN Events e ON b.event_id = e.id
       WHERE b.id = ? AND b.user_id = ?`,
      [id, req.user.id]
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
app.put('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if booking exists and belongs to user
    const booking = await dbGet(
      'SELECT * FROM Bookings WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }
    
    // Update booking status
    await dbRun(
      'UPDATE Bookings SET status = ? WHERE id = ?',
      ['cancelled', id]
    );
    
    // Update event booked seats
    await dbRun(
      'UPDATE Events SET booked_seats = booked_seats - ? WHERE id = ?',
      [booking.number_of_seats, booking.event_id]
    );
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// ==================== ENQUIRY ROUTES ====================

// Create enquiry
app.post('/api/enquiries', authenticateToken, async (req, res) => {
  try {
    const { eventId, message } = req.body;
    const userId = req.user.id;
    
    // Get user details
    const user = await dbGet('SELECT name, email FROM Users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get event details
    const event = await dbGet('SELECT title FROM Events WHERE id = ?', [eventId]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Create enquiry
    const enquiryId = `enquiry_${Date.now()}`;
    
    await dbRun(
      `INSERT INTO Enquiries (id, user_id, user_name, user_email, event_id, event_title, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [enquiryId, userId, user.name, user.email, eventId, event.title, message]
    );
    
    res.status(201).json({ 
      message: 'Enquiry submitted successfully', 
      enquiryId 
    });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// Get user enquiries
app.get('/api/enquiries/my-enquiries', authenticateToken, async (req, res) => {
  try {
    const enquiries = await dbAll(
      'SELECT * FROM Enquiries WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json(enquiries);
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get user notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await dbAll(
      'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('UPDATE Notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ error: 'Failed to mark notification' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await dbRun('UPDATE Notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({ error: 'Failed to mark notifications' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get admin stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [eventsCount, usersCount, bookingsCount, pendingEnquiries] = await Promise.all([
      dbGet('SELECT COUNT(*) as count FROM Events WHERE status = "upcoming"'),
      dbGet('SELECT COUNT(*) as count FROM Users WHERE status = "active"'),
      dbGet('SELECT COUNT(*) as count FROM Bookings'),
      dbGet('SELECT COUNT(*) as count FROM Enquiries WHERE status = "pending"')
    ]);

    // Get recent bookings
    const recentBookings = await dbAll(`
      SELECT b.*, u.name as user_name, u.email as user_email 
      FROM Bookings b 
      JOIN Users u ON b.user_id = u.id 
      ORDER BY b.created_at DESC LIMIT 5
    `);

    // Get recent enquiries
    const recentEnquiries = await dbAll(`
      SELECT * FROM Enquiries 
      ORDER BY created_at DESC LIMIT 5
    `);

    res.json({
      totalEvents: eventsCount?.count || 0,
      totalUsers: usersCount?.count || 0,
      totalBookings: bookingsCount?.count || 0,
      pendingEnquiries: pendingEnquiries?.count || 0,
      recentBookings,
      recentEnquiries
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all users (admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await dbAll(
      'SELECT id, name, email, mobile, registration_date, status, created_at FROM Users ORDER BY created_at DESC'
    );
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user status (admin)
app.put('/api/admin/users/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    await dbRun('UPDATE Users SET status = ? WHERE id = ?', [status, id]);
    
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get all bookings (admin)
app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const bookings = await dbAll(`
      SELECT b.*, u.name as user_name, u.email as user_email, u.mobile as user_mobile,
             e.date as event_date, e.time as event_time, e.end_time as event_end_time,
             e.location as event_location, e.capacity as event_capacity, e.booked_seats as event_booked_seats
      FROM Bookings b
      JOIN Users u ON b.user_id = u.id
      JOIN Events e ON b.event_id = e.id
      ORDER BY b.created_at DESC
    `);
    
    res.json(bookings);
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID (admin)
app.get('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const booking = await dbGet(`
      SELECT b.*, u.name as user_name, u.email as user_email, u.mobile as user_mobile,
             e.date as event_date, e.time as event_time, e.end_time as event_end_time,
             e.location as event_location, e.capacity as event_capacity, e.booked_seats as event_booked_seats
      FROM Bookings b
      JOIN Users u ON b.user_id = u.id
      JOIN Events e ON b.event_id = e.id
      WHERE b.id = ?
    `, [id]);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get admin booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status (admin)
app.put('/api/admin/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    await dbRun('UPDATE Bookings SET status = ? WHERE id = ?', [status, id]);
    
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Get all enquiries (admin)
app.get('/api/admin/enquiries', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const enquiries = await dbAll(
      'SELECT * FROM Enquiries ORDER BY created_at DESC'
    );
    
    res.json(enquiries);
  } catch (error) {
    console.error('Get admin enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Reply to enquiry (admin)
app.put('/api/admin/enquiries/:id/reply', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { reply } = req.body;
    
    await dbRun(
      'UPDATE Enquiries SET admin_reply = ?, status = ? WHERE id = ?',
      [reply, 'replied', id]
    );
    
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Reply to enquiry error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// Create event (admin)
app.post('/api/admin/events', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { 
      title, description, date, time, end_time, type, 
      location, image, capacity, amenities, status 
    } = req.body;
    
    const eventId = `event_${Date.now()}`;
    
    await dbRun(
      `INSERT INTO Events (id, title, description, date, time, end_time, type, 
       location, image, capacity, amenities, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [eventId, title, description, date, time, end_time, type, 
       location, image, capacity, amenities, status || 'upcoming']
    );
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      eventId 
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin)
app.put('/api/admin/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const query = `UPDATE Events SET ${fields.join(', ')} WHERE id = ?`;
    await dbRun(query, values);
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin)
app.delete('/api/admin/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    // Check if event exists
    const event = await dbGet('SELECT id FROM Events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    await dbRun('DELETE FROM Events WHERE id = ?', [id]);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event for editing (admin)
app.get('/api/admin/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const event = await dbGet('SELECT * FROM Events WHERE id = ?', [id]);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get admin event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Forgot password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await dbGet('SELECT id, name FROM Users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // For development
    console.log(`OTP for ${email}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent to email', 
      otp: otp // For development only
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // For demo, verify OTP length
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await dbRun('UPDATE Users SET password = ? WHERE email = ?', [hashedPassword, email]);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 EventEaseWeb Server Started!
================================
✅ Server: http://localhost:${PORT}
✅ API: http://localhost:${PORT}/api
✅ Database: SQLite (eventease.db)

📋 Demo Credentials:
   Admin: admin@example.com / Admin@123
   User:  user@example.com  / User@123

✨ Open your browser: http://localhost:${PORT}
`);
});