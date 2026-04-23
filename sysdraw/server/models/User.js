/**
 * SysDraw - User Model (MVC: Model Layer)
 * Handles user data persistence using JSON file storage
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure data file exists
const ensureFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

const readUsers = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const UserModel = {
  findAll: () => readUsers(),

  findById: (id) => readUsers().find((u) => u.id === id) || null,

  findByUsername: (username) =>
    readUsers().find((u) => u.username === username) || null,

  findByEmail: (email) =>
    readUsers().find((u) => u.email === email) || null,

  create: (userData) => {
    const users = readUsers();
    const newUser = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
  },

  update: (id, updates) => {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    writeUsers(users);
    return users[index];
  },
};

module.exports = UserModel;
