// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import des composants
import CreateGame from './components/CreateGame';
import GameLobby from './components/GameLobby';

// Placeholder temporaire pour la vue mobile (sera développée plus tard)
const MobileJoin = () => (
  <div style={{ padding: 20, textAlign: 'center' }}>Interface Mobile: Rejoindre une partie</div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Page d'accueil : Création de la partie (Figure 27) */}
          <Route path="/" element={<CreateGame />} />
          
          {/* Page Salle d'attente : QR Code (Figure 28) */}
          <Route path="/lobby" element={<GameLobby />} />
          
          {/* Page Joueur Mobile */}
          <Route path="/join" element={<MobileJoin />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;