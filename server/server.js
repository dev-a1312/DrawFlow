// Import required libraries
const express = require('express');   // Express for the web server
const http = require('http');         // HTTP server
const socketIo = require('socket.io'); // Socket.io for real-time communication
const mysql = require('mysql2');       // MySQL integration

// Initialize the express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',        // Your MySQL host (default: localhost)
  user: 'root',             // Your MySQL username
  password: 'tommy', // Your MySQL password
  database: 'drawflow'      // The database we created
});

// Establish the MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Initialize socket connection logic
require('./socket/socketConnection')(io, db);

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
