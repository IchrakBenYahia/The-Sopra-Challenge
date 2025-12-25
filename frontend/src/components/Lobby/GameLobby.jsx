// src/components/GameLobby.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './GameLobby.css';

const GameLobby = () => {
  const location = useLocation();
  // Récupère le nombre de joueurs choisi ou met 4 par défaut
  const maxPlayers = location.state?.maxPlayers || 4;

  const [roomData, setRoomData] = useState({
    roomId: '214',
    joinCode: '3DGT4H', // Simulé ici, viendra du backend plus tard
    url: 'https://mon-jeu-sopra.com/join' // URL à scanner
  });

  // Liste des joueurs simulée (à connecter à Socket.io plus tard)
  const [players, setPlayers] = useState([
    { id: 1, name: 'Sopra Team', color: '#2ecc71' },
    { id: 2, name: 'TRex', color: '#3498db' },
    // On laisse des places vides pour simuler l'attente
  ]);

  // URL complète dans le QR code : ex: https://jeu.com/join?code=3DGT4H
  const qrValue = `${roomData.url}?code=${roomData.joinCode}`;

  return (
    <div className="lobby-container">
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration bottom-right"></div>

      <header className="lobby-header">
        <h1>THE SOPRA CHALLENGE</h1>
      </header>

      <div className="lobby-card">
        <h2 className="room-title">ROOM #{roomData.roomId}</h2>

        <div className="lobby-grid">
          {/* COLONNE GAUCHE : Codes */}
          <div className="info-column">
            
            <div className="info-block">
              <span className="info-label">CODE</span>
              <div className="code-box">{roomData.joinCode}</div>
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

          {/* COLONNE DROITE : Joueurs */}
          <div className="players-column">
            <div className="players-header">
              <span>JOUEURS CONNECTÉS</span>
              <span className="counter">{players.length}/{maxPlayers}</span>
            </div>
            
            <div className="players-list">
              {/* Affichage des joueurs connectés */}
              {players.map((player, index) => (
                <div key={player.id} className="player-row">
                  <span className="player-number">Joueur {index + 1}</span>
                  <strong className="player-name">{player.name}</strong>
                </div>
              ))}

              {/* Affichage des places vides */}
              {[...Array(maxPlayers - players.length)].map((_, i) => (
                <div key={`empty-${i}`} className="player-row empty">
                  <span className="player-number">Joueur {players.length + i + 1}</span>
                  <span className="dots">...</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;