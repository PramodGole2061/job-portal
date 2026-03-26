import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

import connectToMongo from './middleware/db.js';
import candidateAuthRoutes from './routes/candidateAuth.js';
import employeeAuthRoutes from './routes/employerAuth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import { apiLimiter } from './middleware/rateLimiter.js';

connectToMongo();

dotenv.config();

//cv upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

// Apply the rate limiter API routes
app.use('/api', apiLimiter);

// middleware to resolve CORS 
app.use(cors());

// middleware to parse JSON in request bodies
app.use(express.json());

// ROUTES
// Candidate Authentication Routes
app.use('/api/auth/candidate', candidateAuthRoutes);

// Employer Authentication Routes
app.use('/api/auth/employer', employeeAuthRoutes);

// Job Routes
app.use('/api/jobs', jobRoutes); 

//cv upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// application routes
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Job Portal Backend is Running.');
});

// Start the server
app.listen(port, () => {
  console.log(`Job Portal Backend listening at http://localhost:${port}`);
});