const express = require('express');
const router = express.Router();

let db;
const setDB = (database) => { db = database; };

router.get('/random', (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.titre AS carte_titre,
      t.nom AS theme_nom,
      t.couleur AS theme_couleur
    FROM Cartes c
    JOIN Theme t ON c.id_theme = t.id
    ORDER BY RAND()
    LIMIT 1
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// GET /cartes/:id
router.get('/:id', (req, res) => {
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
    if (results.length === 0) return res.status(404).json({ error: "Carte non trouvée" });
    res.json(results[0]);
  });
});

module.exports = { router, setDB };
