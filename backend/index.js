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
    const roomId = generateRoomCode();
    rooms[roomId] = {
      players: [],
      maxPlayers: data.maxPlayers || 4,
      status: 'waiting',
      hostId: socket.id
    };
    socket.join(roomId);
    socket.emit('room_created', { roomId });
    console.log(`Salle créée : ${roomId} (Max: ${data.maxPlayers})`);
  });

  // --- ÉVÉNEMENTS JOUEUR ---
  socket.on('join_room', (data) => {
    const { gameCode, nickname, avatarColor } = data;
    const room = rooms[gameCode];

    if (!room) {
      socket.emit('error_message', "Cette salle n'existe pas.");
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit('error_message', "La salle est complète !");
      return;
    }

    const newPlayer = {
      id: socket.id,
      name: nickname,
      color: avatarColor,
      score: 0
    };

    room.players.push(newPlayer);
    socket.join(gameCode);
    io.to(gameCode).emit('update_player_list', room.players);
    socket.emit('join_success', { gameCode });
    console.log(`${nickname} a rejoint la salle ${gameCode}`);
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
server.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port} 🚀`);
});
