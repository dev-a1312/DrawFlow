const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Setup middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'tommy',  // Replace with your MySQL password
  database: 'drawflow',  // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// POST route to save the drawing
app.post('/save-drawing', (req, res) => {
  const { drawingData } = req.body;  // Get drawing data from the request body

  const query = 'INSERT INTO drawings (drawing_data) VALUES (?)';
  db.query(query, [drawingData], (err, result) => {
    if (err) {
      console.error('Error saving drawing: ', err);
      return res.status(500).send('Error saving drawing');
    }
    res.status(200).send({ message: 'Drawing saved successfully!' });
  });
});

// GET route to fetch all saved drawings
app.get('/load-drawings', (req, res) => {
    const query = 'SELECT * FROM drawings ORDER BY created_at DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching drawings: ', err);
        return res.status(500).send('Error fetching drawings');
      }
      res.status(200).json(results);  // Send all drawings as response
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
