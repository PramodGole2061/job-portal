require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware to resolve CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware to parse JSON in request bodies
app.use(express.json());

// -----------------------------------------------------------------------
// AVAILABLE ROUTES
// -----------------------------------------------------------------------

// 1. Candidate Authentication Routes (Signup/Login for Job Seekers)
app.use('/api/auth/candidate', require('./routes/candidateAuth'));

// 2. Employer Authentication Routes (Signup/Login for Companies)
app.use('/api/auth/employer', require('./routes/employerAuth'));

// 3. Job Routes (Replaces the old notes.js)
// Note: You will need to create 'routes/jobs.js' later to handle job postings
app.use('/api/jobs', require('./routes/jobs.js')); 


// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Job Portal Backend is Running - Welcome Pramod Gole!');
});

// Start the server
app.listen(port, () => {
  console.log(`Job Portal Backend listening at http://localhost:${port}`);
});