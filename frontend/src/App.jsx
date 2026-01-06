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
import MobileGame from './components/Lobby/MobileGame'; // ✅ Nouveau fichier


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Écran Hôte */}
          <Route path="/" element={<CreateGame />} />
          <Route path="/lobby" element={<GameLobby />} />
         
          {/* Écran Joueur : Connexion */}
          <Route path="/join" element={<MobileJoin />} />


          {/* Écran Joueur : Le jeu unifié (Plateau <-> Question) */}
          <Route path="/mobile/game/:gameCode" element={<MobileGame />} />


          {/* Écran Animateur : Le Plateau Géant */}
          <Route path="/plateau/:gameCode" element={<Plateau />} />


          {/* Route technique si besoin de tester les questions seules */}
          <Route path="/question" element={<GameFlow />} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
