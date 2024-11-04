require('dotenv').config();
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRoutes);

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`🚀 Server běží na portu ${PORT}`);
});