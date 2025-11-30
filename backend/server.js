require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// security headers
app.use(helmet());

// basic rate limiter (tune for production)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// sanitize user-supplied data to prevent operator injection
app.use(mongoSanitize());

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db');

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
