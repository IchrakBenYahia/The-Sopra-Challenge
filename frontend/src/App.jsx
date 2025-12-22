// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import des composants
import CreateGame from './components/CreateGame';
import GameLobby from './components/GameLobby';
import MobileJoin from './components/MobileJoin'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Écran Hôte : Création de la partie */}
          <Route path="/" element={<CreateGame />} />
          
          {/* Écran Hôte : Salle d'attente (Lobby) */}
          <Route path="/lobby" element={<GameLobby />} />
          
          {/* Écran Joueur : Connexion Mobile & Choix du pion */}
          <Route path="/join" element={<MobileJoin />} />

          {/* Redirection par défaut vers l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;