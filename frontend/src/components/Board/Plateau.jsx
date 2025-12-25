import React, { useState } from "react";
import Board from "./Board";

export default function Plateau() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Joueur 1", color_type: "vert", currentCell: 0 },
    { id: 2, name: "Joueur 2", color_type: "rose", currentCell: 0 },
    { id: 3, name: "Joueur 3", color_type: "jaune", currentCell: 0 },
    { id: 4, name: "Joueur 4", color_type: "bleu_ciel", currentCell: 0 },
    { id: 5, name: "Joueur 5", color_type: "bleu", currentCell: 0 },
  ]);

  // Fonction pour déplacer un joueur suite à une réponse valide
  const movePlayer = (playerId, steps) => {
    setTeams(prev => prev.map(p => {
      if (p.id === playerId) {
        let next = p.currentCell + steps;
        // On s'arrête à la case 29 (fin du plateau)
        return { ...p, currentCell: next > 29 ? 29 : next };
      }
      return p;
    }));
  };

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontFamily: "Tahoma" }}>The Sopra Challenge</h1>
      
      {/* showDebug={false} pour masquer les zones de placement blanches */}
      <Board teams={teams} showDebug={false} />

      {/* Interface temporaire de test pour simuler l'avancement */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
        {teams.map(p => (
          <button key={p.id} onClick={() => movePlayer(p.id, 1)}>
            Avancer {p.name} (+1)
          </button>
        ))}
      </div>
    </div>
  );
}