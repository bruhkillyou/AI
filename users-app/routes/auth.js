const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registrace
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(400).send('Chyba pøi registraci: ' + err);
    }
});

// Pøihlášení
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Uživatel neexistuje');
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
        req.session.userId = user._id;
        res.redirect('/profile');
    } else {
        res.status(400).send('Nesprávné heslo');
    }
});

// Profil
router.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
});

// Odhlášení
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Smazání úètu
router.get('/delete', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    await User.findByIdAndDelete(req.session.userId);
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
