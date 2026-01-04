import React, { useEffect, useState } from "react";
import Board from "./Board";
import { socket } from "../../socket";

export default function Plateau() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Début de partie
    socket.on("start_game", (data) => {
      const mappedTeams = data.players.map((p) => ({
        id: p.joueurId,
        name: p.name,
        color_type: p.color,
        currentCell: p.currentCell ?? 0
      }));
      setTeams(mappedTeams);
    });

    // Mise à jour des positions
    socket.on("update_positions", (players) => {
      const mappedTeams = data.players.map((p) => ({
        id: p.joueurId,
        name: p.name,
        color_type: p.color in PLAYER_ASSETS ? p.color : "vert",
        currentCell: p.currentCell ?? 0
      }));
      setTeams(mappedTeams);
    });

    return () => {
      socket.off("start_game");
      socket.off("update_positions");
    };
  }, []);

  const movePlayer = (joueurId, steps = 1) => {
  // gameCode doit provenir de la route ou du state
  const gameCode = localStorage.getItem("gameCode"); // exemple : stocké avant
  if (!gameCode) return;

  socket.emit("move_player", { gameCode, joueurId, steps });
};

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>The Sopra Challenge</h1>
      <Board teams={teams} showDebug={false} />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
  {teams.map(p => (
    <button key={p.id} onClick={() => movePlayer(p.id)}>
      Avancer {p.name} (+1)
    </button>
  ))}
</div>
    </div>
  );
}
