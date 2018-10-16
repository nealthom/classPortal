require('dotenv').config(); //import environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const students = require('./routes/api/students');
const profile = require('./routes/api/profile');
const assignments = require('./routes/api/assignments');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Config
const db = process.env.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.log(err));

const port = process.env.Port || 5000;

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/students', students);
app.use('/api/assignments', assignments);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
