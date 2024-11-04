const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Vytvoření instance Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Definice modelu uživatele
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Hash hesla před uložením
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Metoda pro ověření hesla
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Synchronizace databáze
sequelize.sync();

module.exports = User;