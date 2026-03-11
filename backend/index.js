import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'

import connectToMongo from './middleware/db.js';
import candidateAuthRoutes from './routes/candidateAuth.js';
import employeeAuthRoutes from './routes/employerAuth.js';
import jobRoutes from './routes/jobs.js';

connectToMongo();

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware to resolve CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware to parse JSON in request bodies
app.use(express.json());

// ROUTES
// Candidate Authentication Routes
app.use('/api/auth/candidate', candidateAuthRoutes);

// Employer Authentication Routes
app.use('/api/auth/employer', employeeAuthRoutes);

// Job Routes
app.use('/api/jobs', jobRoutes); 


app.get('/', (req, res) => {
  res.send('Job Portal Backend is Running.');
});

// Start the server
app.listen(port, () => {
  console.log(`Job Portal Backend listening at http://localhost:${port}`);
});