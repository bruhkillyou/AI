const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);
    
    res.status(201).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({ error: 'Uživatelské jméno nebo email již existuje' });
    }
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email }});
    if (!user) {
      return res.status(401).send({ error: 'Nesprávný email nebo heslo' });
    }
    
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Nesprávný email nebo heslo' });
    }

    const token = generateToken(user);
    res.send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.send({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email
  });
};

exports.deleteAccount = async (req, res) => {
  try {
    await req.user.destroy();
    res.send({ message: 'Účet byl úspěšně odstraněn' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};