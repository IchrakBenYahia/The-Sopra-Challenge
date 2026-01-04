// backend/server.js (fusion index.js + server.js)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

// --- Configuration Express ---
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Connexion à la base de données MySQL ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sopra_challenge'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur connexion BD :', err);
  } else {
    console.log('Connecté à MySQL !');
  }
});

// --- Import des routes ---
const questionsRoute = require('./routes/questions');
questionsRoute.setDB(db);
app.use('/questions', questionsRoute.router);

const cartesRoute = require('./routes/cartes');
cartesRoute.setDB(db);
app.use('/cartes', cartesRoute.router);

// --- Création du serveur HTTP + Socket.io ---
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// --- Stockage temporaire des parties ---
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  // --- ÉVÉNEMENTS HÔTE ---
socket.on('create_room', (data) => {
  const roomCode = generateRoomCode();

  // ⚠️ pour l’instant on met animateur_id = 1 (admin ou animateur)
  const sql = `
    INSERT INTO Partie (animateur_id, contexte_id)
    VALUES (?, ?)
  `;

  db.query(sql, [1, 1], (err, result) => {
    if (err) {
      console.error(err);
      socket.emit('error_message', "Erreur création partie");
      return;
    }

    const partieId = result.insertId;

    rooms[roomCode] = {
      partieId, // 🔥 LIEN DB ↔ SOCKET
      players: [],
      maxPlayers: data.maxPlayers,
      status: 'waiting',
      hostId: socket.id
    };

    socket.join(roomCode);
    socket.emit('room_created', { roomId: roomCode });
    console.log(`Salle créée : ${roomCode} (Max: ${data.maxPlayers})`);
  });
});

  // --- ÉVÉNEMENTS JOUEUR ---
socket.on('join_room', (data) => {
  const { gameCode, nickname, avatarColor } = data;
  const room = rooms[gameCode];

  if (!room) {
    socket.emit('error_message', "Cette salle n'existe pas.");
    return;
  }

  // Anti-doublon socket
  const alreadyJoined = room.players.some(p => p.id === socket.id);
  if (alreadyJoined) {
    socket.emit('error_message', "Vous êtes déjà dans la partie");
    return;
  }

  if (room.players.length >= room.maxPlayers) {
    socket.emit('error_message', "La salle est complète !");
    return;
  }

  const insertJoueurSql = `
    INSERT INTO Joueur (nom, score, position)
    VALUES (?, 0, 0)
  `;

  db.query(insertJoueurSql, [nickname], (err, result) => {
    if (err) {
      console.error(err);
      socket.emit('error_message', "Erreur création joueur");
      return;
    }

    const joueurId = result.insertId;

    const linkSql = `
      INSERT INTO Joueur_Partie (joueur_id, partie_id)
      VALUES (?, ?)
    `;

    db.query(linkSql, [joueurId, room.partieId], (err) => {
      if (err) {
        console.error(err);
        socket.emit('error_message', "Erreur liaison joueur-partie");
        return;
      }

    const colorMap = {
      green: "vert",
      pink: "rose",
      yellow: "jaune",
      sky: "bleu_ciel",
      blue: "bleu"
    };

    const newPlayer = {
      id: socket.id,
      joueurId,
      name: nickname,
      color: colorMap[avatarColor] || "vert", // valeur par défaut
      score: 0,
      currentCell: 0
    };

      room.players.push(newPlayer);
      socket.join(gameCode);

      io.to(gameCode).emit('update_player_list', room.players);
      socket.emit('join_success', { gameCode });

      if (room.players.length === room.maxPlayers) {
        io.to(gameCode).emit('start_game', {
          players: room.players
        });
      }
    });
  });
});

socket.on("move_player", ({ gameCode, joueurId, steps }) => {
  const room = rooms[gameCode];
  if (!room) return;

  const player = room.players.find(p => p.joueurId === joueurId);
  if (!player) return;

  // Déplacement, max 29 cases
  player.currentCell = Math.min(player.currentCell + steps, 29);

  // Synchronisation avec tous les joueurs
  io.to(gameCode).emit("update_positions", room.players);
});


  socket.on('disconnect', () => {
    console.log(`Déconnexion : ${socket.id}`);
    // Gestion éventuelle de suppression de joueur
  });
});

// --- Fonction utilitaire pour générer un code de salle ---
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// --- Démarrage du serveur ---
server.listen(port, '0.0.0.0', () => {
  console.log(`Serveur lancé sur http://0.0.0.0:${port} 🚀`);
});

