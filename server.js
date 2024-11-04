const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware pro parsování JSON
app.use(express.json());

// Obsluha statických souborů
app.use(express.static('public'));

// Připojení k MongoDB
connectDB();

// Použití tras pro uživatele
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
