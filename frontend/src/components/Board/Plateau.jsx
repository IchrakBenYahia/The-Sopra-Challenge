// src/components/Board/Plateau.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { socket } from "../../socket";
import Board from "./Board";


// On ajoute isMobileView en prop pour savoir si c'est un joueur ou l'animateur
export default function Plateau({ isMobileView = false }) {
  const params = useParams();
  // Si on est dans MobileGame, le param peut venir de props ou URL.
  // Ici on sécurise la récupération du gameCode.
  const gameCode = params.gameCode;
 
  const location = useLocation();


  const formatPlayers = (list) => {
    return list.map(p => ({
      ...p,
      color_type: p.color
    }));
  };


  const [teams, setTeams] = useState(
    location.state?.players ? formatPlayers(location.state.players) : []
  );


  useEffect(() => {
    if (teams.length === 0 && gameCode) {
      socket.emit('get_initial_players', gameCode);
    }


    socket.on("update_positions", (updatedPlayers) => {
      setTeams(formatPlayers(updatedPlayers));
    });


    return () => {
      socket.off("update_positions");
    };
  }, [gameCode, teams.length]);


  // --- ACTIONS ANIMATEUR ---


  const handleMovePlayer = (joueurId, steps) => {
    socket.emit("move_player", { gameCode, joueurId, steps });
  };


  const handleAskQuestion = (playerId) => {
      // Déclenche l'écran de question sur le téléphone du joueur
      socket.emit('open_question_for_player', { gameCode, playerId });
  };


  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh", padding: "20px" }}>
      <div style={{ position: "absolute", top: 10, left: 10, color: "#999" }}>
        Room: {gameCode}
      </div>
     
      {teams.length > 0 ? (
        <>
          <Board teams={teams} showDebug={false} />


          {/* N'AFFICHER LES BOUTONS QUE SI CE N'EST PAS UN MOBILE (Donc Animateur uniquement) */}
          {!isMobileView && (
            <div style={{
                marginTop: "30px",
                padding: "20px",
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 -5px 20px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{textAlign: "center", marginBottom: "20px", color: "#333"}}>🎮 Contrôles Animateur</h3>
             
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
                {teams.map(p => (
                  <div key={p.joueurId} style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#fafafa",
                      textAlign: "center"
                  }}>
                    <strong style={{display:"block", marginBottom:"10px", color: "#333"}}>{p.name}</strong>
                   
                    <div style={{ display: "flex", gap: "5px" }}>
                        {/* Bouton Avancer */}
                        <button
                            onClick={() => handleMovePlayer(p.joueurId, 1)}
                            style={{
                            padding: "8px 12px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold"
                            }}
                        >
                            👣 Avancer +1
                        </button>


                        {/* Bouton Question */}
                        <button
                            onClick={() => handleAskQuestion(p.id)} // p.id est l'ID socket
                            style={{
                            padding: "8px 12px",
                            background: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold"
                            }}
                        >
                            ❓ Question
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20%", fontSize: "1.5rem", color: "#555" }}>
          <p>⏳ Chargement de la partie...</p>
        </div>
      )}
    </div>
  );
}
