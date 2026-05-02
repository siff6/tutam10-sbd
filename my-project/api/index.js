const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke database
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

connectDB();

app.use('/api/todos', require('./routes/todoRoutes'));

module.exports = app;