const express = require('express');
const router = express.Router();

// Importer la connexion DB depuis server.js
let db;
const setDB = (database) => {
  db = database;
};

// Route pour récupérer toutes les questions
router.get('/', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = { router, setDB };
