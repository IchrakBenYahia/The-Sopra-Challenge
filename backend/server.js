const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

app.use(express.json());

// Connexion DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sopra_challenge'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur connexion BD :', err);
  } else {
    console.log('Connecté à MySQL !');
  }
});

// Import des routes
const questionsRoute = require('./routes/questions');
questionsRoute.setDB(db);
app.use('/questions', questionsRoute.router);

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
