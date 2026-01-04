// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import des composants
import CreateGame from './components/Lobby/CreateGame';
import GameLobby from './components/Lobby/GameLobby';
import Plateau from './components/Board/Plateau';
import GameFlow from "./components/Question/GameFlow";
import MobileJoin from './components/Lobby/MobileJoin'; 

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

          {/* Page Plateau de jeu */}
          <Route path="/plateau" element={<Plateau />} />

          <Route path="/question" element={<GameFlow />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
