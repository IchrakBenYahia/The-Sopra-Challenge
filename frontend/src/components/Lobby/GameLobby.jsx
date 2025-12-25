// src/components/GameLobby.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { socket } from '../../socket'; // Import de la connexion serveur
import './GameLobby.css';

const GameLobby = () => {
  const location = useLocation();
  
  // Récupération des données passées par CreateGame (ou valeurs par défaut)
  const maxPlayers = location.state?.maxPlayers || 4;
  const roomId = location.state?.roomId || "----"; 

  // L'URL que les joueurs doivent ouvrir (votre IP locale ou localhost)
  // window.location.origin donne "http://localhost:5173"
  const joinUrl = `${window.location.origin}/join`; 
  const qrValue = `${joinUrl}?code=${roomId}`;

  const [players, setPlayers] = useState([]);

  // Pagination pour l'affichage (si > 4 joueurs)
  const PLAYERS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Écouter la mise à jour de la liste des joueurs depuis le serveur
    socket.on('update_player_list', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Nettoyage de l'écouteur quand on quitte la page
    return () => {
      socket.off('update_player_list');
    };
  }, []);

  // --- LOGIQUE D'AFFICHAGE (PAGINATION) ---
  const currentPlayers = players.slice(
    currentPage * PLAYERS_PER_PAGE,
    (currentPage + 1) * PLAYERS_PER_PAGE
  );

  // Calcul des slots vides à afficher pour combler la grille
  // On veut toujours afficher 'maxPlayers' slots au total, répartis par pages
  // Combien de slots on affiche sur CETTE page ?
  const slotsOnThisPage = Math.min(PLAYERS_PER_PAGE, maxPlayers - (currentPage * PLAYERS_PER_PAGE));
  const emptySlotsCount = Math.max(0, slotsOnThisPage - currentPlayers.length);

  return (
    <div className="lobby-container">
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration bottom-right"></div>

      <header className="lobby-header">
        <h1>THE SOPRA CHALLENGE</h1>
      </header>

      <div className="lobby-card">
        <h2 className="room-title">ROOM #{roomId}</h2>

        <div className="lobby-grid">
          {/* COLONNE GAUCHE : Codes */}
          <div className="info-column">
            
            <div className="info-block">
              <span className="info-label">CODE</span>
              <div className="code-box">{roomId}</div>
            </div>

            <div className="info-block">
              <span className="info-label">QR CODE</span>
              <div className="qr-wrapper">
                <QRCodeCanvas 
                  value={qrValue} 
                  size={180}
                  level={"H"}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  includeMargin={true}
                />
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Liste des joueurs */}
          <div className="players-column">
            <div className="players-header">
              <span>JOUEURS CONNECTÉS</span>
              <span className="counter">{players.length}/{maxPlayers}</span>
            </div>
            
            <div className="players-list">
              {/* Joueurs réels */}
              {currentPlayers.map((player, index) => (
                <div key={player.id} className="player-row">
                  <span className="player-number">
                    Joueur {currentPage * PLAYERS_PER_PAGE + index + 1}
                  </span>
                  <strong className="player-name" style={{ color: player.color }}>
                    {player.name}
                  </strong>
                </div>
              ))}

              {/* Places vides (En attente...) */}
              {[...Array(emptySlotsCount)].map((_, i) => (
                <div key={`empty-${i}`} className="player-row empty">
                  <span className="player-number">
                    Joueur {players.length + i + 1}
                  </span>
                  <span className="dots">En attente...</span>
                </div>
              ))}
            </div>

             {/* Flèches de pagination si besoin */}
             {maxPlayers > PLAYERS_PER_PAGE && (
              <div className="pagination-controls">
                 {/* Ajoutez ici des boutons Précédent/Suivant si vous gérez > 4 joueurs */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;