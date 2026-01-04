const express = require('express');
const router = express.Router();

// Importer la connexion DB depuis server.js
let db;
const setDB = (database) => {
  db = database;
};

router.get('/cartes/:id', (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.titre AS carte_titre,
      t.nom AS theme_nom,
      t.couleur AS theme_couleur
    FROM Cartes c
    JOIN Theme t ON c.id_theme = t.id
    WHERE c.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});


// Route pour récupérer une question
router.get('/random', (req, res) => {
  const { carteId, niveau, type } = req.query;

  const sql = `
    SELECT 
      q.id,
      q.texte,
      q.type,
      q.niveau,
      q.reponse,

      c.titre AS carte_titre,

      t.nom AS theme_nom,
      t.couleur AS theme_couleur
    FROM Question q
    JOIN Cartes c ON q.carte_id = c.id
    JOIN Theme t ON c.id_theme = t.id
    WHERE q.carte_id = ?
      AND q.niveau = ?
      AND q.type = ?
    ORDER BY RAND()
    LIMIT 1
  `;

  db.query(sql, [carteId, niveau, type], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ error: "Aucune question trouvée" });
    }

    res.json(results[0]);
  });
});

router.get('/types', (req, res) => {
  const { carteId, niveau } = req.query;

  const sql = `
    SELECT DISTINCT type
    FROM Question
    WHERE carte_id = ?
      AND niveau = ?
  `;

  db.query(sql, [carteId, niveau], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results.map(r => r.type));
  });
});


module.exports = {
  router,
  setDB
};

