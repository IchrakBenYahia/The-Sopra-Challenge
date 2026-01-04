// src/components/CreateGame.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket'; // Assurez-vous d'avoir créé le fichier src/socket.js
import "../../styles/Lobby/CreateGame.css";

const CreateGame = () => {
  const navigate = useNavigate();
  
  // Par défaut sur 4 (comme sur la maquette Figure 27)
  const [playerCount, setPlayerCount] = useState(4);
  
  // Limites du jeu (Section 4.1 du rapport)
  const minPlayers = 2;
  const maxPlayers = 5;

  // --- LOGIQUE SOCKET.IO ---

  const handleCreate = () => {
    // 1. On demande au serveur de créer une salle
    // On envoie aussi le nombre de joueurs max pour que le serveur le sache
    socket.emit('create_room', { maxPlayers: playerCount });
  };

  useEffect(() => {
    // 2. On attend la confirmation du serveur avec le code de la salle
    const onRoomCreated = (data) => {
      console.log("Salle créée :", data.roomId);
      
      // 3. On navigue vers le Lobby en passant le Code et le Nb de joueurs
      navigate('/lobby', { 
        state: { 
          roomId: data.roomId, 
          maxPlayers: playerCount 
        } 
      });
    };

    socket.on('room_created', onRoomCreated);

    // Nettoyage de l'écouteur si le composant est démonté
    return () => {
      socket.off('room_created', onRoomCreated);
    };
  }, [navigate, playerCount]);

  // --- LOGIQUE INTERFACE ---

  const increase = () => {
    if (playerCount < maxPlayers) setPlayerCount(playerCount + 1);
  };

  const decrease = () => {
    if (playerCount > minPlayers) setPlayerCount(playerCount - 1);
  };

  return (
    <div className="create-container">
      {/* Décorations de coins */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration bottom-right"></div>

      <h1 className="main-title">THE SOPRA CHALLENGE</h1>

      <div className="configuration-area">
        
        {/* Partie Gauche : Le Bouton Créer */}
        <div className="action-side">
          <button onClick={handleCreate} className="create-btn">
            CRÉER UNE PARTIE
          </button>
        </div>

        {/* Partie Droite : Le Sélecteur de nombre "Roulette" */}
        <div className="selector-side">
          
          <div className="number-wheel">
            {/* Chiffre du dessus (précédent) */}
            <div className="number-faded" onClick={decrease}>
              {playerCount > minPlayers ? playerCount - 1 : ''}
            </div>

            {/* Chiffre sélectionné */}
            <div className="number-selected">
              {playerCount}
            </div>

            {/* Chiffre du dessous (suivant) */}
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