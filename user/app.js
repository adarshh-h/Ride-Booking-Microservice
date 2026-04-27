const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
connectDB();
const rabbitMq = require('./service/rabbit')

rabbitMq.connect();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

module.exports = app;