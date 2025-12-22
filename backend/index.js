const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuration de Socket.io pour accepter les connexions du Frontend
// backend/index.js

const io = new Server(server, {
  cors: {
    // Mettez "*" pour accepter toutes les connexions (PC, Mobile, etc.)
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Stockage temporaire des parties (en mémoire)
// Structure : { "CODE_SALLE": { players: [], status: 'waiting', maxPlayers: 4 } }
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  // --- ÉVÉNEMENTS HÔTE (PC/TV) ---

  // L'animateur crée une partie
  socket.on('create_room', (data) => {
    const roomId = generateRoomCode(); // Ex: "XY78"
    
    // On crée la salle en mémoire
    rooms[roomId] = {
      players: [],
      maxPlayers: data.maxPlayers || 4,
      status: 'waiting',
      hostId: socket.id
    };

    socket.join(roomId); // Le socket de l'animateur rejoint la salle "Socket.io"
    
    // On renvoie le code à l'animateur pour qu'il l'affiche
    socket.emit('room_created', { roomId });
    console.log(`Salle créée : ${roomId} (Max: ${data.maxPlayers})`);
  });

  // --- ÉVÉNEMENTS JOUEUR (MOBILE) ---

  // Un joueur tente de rejoindre
  socket.on('join_room', (data) => {
    const { gameCode, nickname, avatarColor } = data;
    const room = rooms[gameCode];

    // Vérifications de sécurité
    if (!room) {
      socket.emit('error_message', "Cette salle n'existe pas.");
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit('error_message', "La salle est complète !");
      return;
    }

    // Création du joueur
    const newPlayer = {
      id: socket.id,
      name: nickname,
      color: avatarColor,
      score: 0
    };

    // Ajout du joueur à la liste
    room.players.push(newPlayer);
    socket.join(gameCode); // Le joueur rejoint la salle Socket.io

    // IMPORTANT : On prévient TOUT LE MONDE dans la salle (surtout l'animateur)
    // que la liste des joueurs a changé.
    io.to(gameCode).emit('update_player_list', room.players);
    
    // On confirme au joueur qu'il a rejoint
    socket.emit('join_success', { gameCode });
    
    console.log(`${nickname} a rejoint la salle ${gameCode}`);
  });

  socket.on('disconnect', () => {
    console.log(`Déconnexion : ${socket.id}`);
    // Ici, on pourrait gérer la suppression du joueur s'il quitte
  });
});

// Fonction utilitaire pour générer un code à 4 lettres/chiffres
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

server.listen(3001, () => {
  console.log('LE SERVEUR TOURNE SUR LE PORT 3001 🚀');
});