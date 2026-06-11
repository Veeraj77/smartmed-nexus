const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/index');
const { globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'SmartMed Nexus API is running', timestamp: new Date().toISOString() });
});

// Routes will be registered here in Phase 2
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(globalErrorHandler);

module.exports = app;
