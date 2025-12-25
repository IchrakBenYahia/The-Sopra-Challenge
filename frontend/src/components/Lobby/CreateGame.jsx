// src/components/CreateGame.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGame.css';

const CreateGame = () => {
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(4); // Valeur par défaut vue sur la maquette
  const minPlayers = 2;
  const maxPlayers = 5; // Selon section 4.1 du rapport

  const handleCreate = () => {
    // On passe le nombre de joueurs au Lobby via l'état de la route
    navigate('/lobby', { state: { maxPlayers: playerCount } });
  };

  const increase = () => {
    if (playerCount < maxPlayers) setPlayerCount(playerCount + 1);
  };

  const decrease = () => {
    if (playerCount > minPlayers) setPlayerCount(playerCount - 1);
  };

  return (
    <div className="create-container">
      {/* Éléments décoratifs (Coins) */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration bottom-right"></div>

      <h1 className="main-title">THE SOPRA CHALLENGE</h1>

      <div className="configuration-area">
        {/* Bouton Créer */}
        <div className="action-side">
          <button onClick={handleCreate} className="create-btn">
            CRÉER UNE PARTIE
          </button>
        </div>

        {/* Sélecteur de nombre de joueurs (Roulette) */}
        <div className="selector-side">
          <div className="number-wheel">
            <div className="number-faded" onClick={decrease}>
              {playerCount > minPlayers ? playerCount - 1 : ''}
            </div>
            
            <div className="number-selected">
              {playerCount}
            </div>
            
            <div className="number-faded" onClick={increase}>
              {playerCount < maxPlayers ? playerCount + 1 : ''}
            </div>
          </div>
          <span className="label-players">JOUEURS</span>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;