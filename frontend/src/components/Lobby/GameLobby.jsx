import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { socket } from '../../socket';
import "../../styles/Lobby/GameLobby.css";


const GameLobby = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // Récupération des données
  const maxPlayers = location.state?.maxPlayers || 4;
  const roomId = location.state?.roomId || "----";


  const joinUrl = `${window.location.protocol}//${window.location.hostname}:5173/join`;
  const qrValue = `${joinUrl}?code=${roomId}`;


  const [players, setPlayers] = useState([]);
  const PLAYERS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);


  useEffect(() => {
    // 1. Écouter la mise à jour de la liste des joueurs
    socket.on('update_player_list', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });


    // 2. Écouter le signal de départ (envoyé par le backend)
    socket.on('game_started', (data) => {
      console.log("Jeu démarré, redirection vers le plateau...");
      // ✅ Redirection AVEC le code de la salle dans l'URL
      navigate(`/plateau/${data.gameCode}`, { state: { players: data.players } });
    });


    return () => {
      socket.off('update_player_list');
      socket.off('game_started');
    };
  }, [navigate]);


  // ✅ Fonction déclenchée par le bouton ROSE
  const handleStartGame = () => {
    if (players.length > 0) {
      socket.emit('start_game', roomId); // Envoie l'ordre au serveur
    } else {
      alert("Il faut au moins 1 joueur pour lancer !");
    }
  };


  // --- LOGIQUE D'AFFICHAGE (PAGINATION) ---
  const currentPlayers = players.slice(
    currentPage * PLAYERS_PER_PAGE,
    (currentPage + 1) * PLAYERS_PER_PAGE
  );


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
                {currentPlayers.map((player, index) => (
                  <div key={`${player.id}-${index}`} className="player-row">
                    <span className="player-number">
                      Joueur {currentPage * PLAYERS_PER_PAGE + index + 1}
                    </span>
                    {/* Gestion de la couleur du texte */}
                    <strong
                        className="player-name"
                        style={{ color: player.color === 'vert' ? '#4CAF50' : player.color }}
                    >
                      {player.name}
                    </strong>
                  </div>
                ))}


              {/* Places vides */}
              {[...Array(emptySlotsCount)].map((_, i) => (
                <div key={`empty-${i}`} className="player-row empty">
                  <span className="player-number">
                    Joueur {players.length + i + 1}
                  </span>
                  <span className="dots">En attente...</span>
                </div>
              ))}
            </div>


             {/* ✅ LE BOUTON LANCER LA PARTIE */}
             <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <button
                    onClick={handleStartGame}
                    style={{
                        padding: "15px 40px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "white",
                        background: players.length > 0 ? "#E91E63" : "#ccc",
                        border: "none",
                        borderRadius: "50px",
                        cursor: players.length > 0 ? "pointer" : "not-allowed",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                    }}
                    disabled={players.length === 0}
                >
                  LANCER LA PARTIE 🚀
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default GameLobby;
