const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

// Naèítání konfigurace z .env souboru
require('dotenv').config();

const app = express();
const port = 3000;

// Pøipojení k databázi MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Pøipojeno k databázi'))
    .catch((err) => console.log('Chyba pøi pøipojení k databázi:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,  // Tajný klíè pro session
    resave: false,
    saveUninitialized: true,
}));

// Nastavení šablonového enginu (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cesty
app.use(authRoutes);

// Domovská stránka
app.get('/', (req, res) => {
    res.render('index');
});

// Spuštìní serveru
app.listen(port, () => {
    console.log(`Server bìží na http://localhost:${port}`);
});
