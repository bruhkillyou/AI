const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registrace
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Přihlášení
router.post('/login', async (req, res) => {
    // Implementace přihlášení (jednoduché ověření uživatelského jména a hesla)
});

// Zobrazit profil
router.get('/profile/:id', async (req, res) => {
    // Implementace zobrazení profilu uživatele
});

// Odstranit účet
router.delete('/profile/:id', async (req, res) => {
    // Implementace odstranění účtu uživatele
});

module.exports = router;

// Přihlášení
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

