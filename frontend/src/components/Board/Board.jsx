import React from "react";
import "./Board.css";
import boardSvg from "../../assets/plateau.svg";
import { boardCells } from "./boardCells";

// Importation des images des personnages
import pionVert from "../../assets/Joueur_1.png";
import pionRose from "../../assets/Joueur_2.png";
import pionJaune from "../../assets/Joueur_3.png";
import pionBleuCiel from "../../assets/Joueur_4.png";
import pionBleu from "../../assets/Joueur_5.png";

const PLAYER_ASSETS = {
  vert: pionVert,
  rose: pionRose,
  jaune: pionJaune,
  bleu_ciel: pionBleuCiel,
  bleu: pionBleu
};

export default function Board({ teams, onCellClick, showDebug = false }) {
  
  // Calcule un décalage en grille pour éviter que les 5 joueurs se cachent
  const getPositionOffset = (playerId, cellId) => {
    const playersOnCell = teams.filter(t => t.currentCell === cellId);
    const index = playersOnCell.findIndex(t => t.id === playerId);
    return {
      x: (index % 3) * 12, // Décalage horizontal
      y: Math.floor(index / 3) * 12 // Décalage vertical
    };
  };

  return (
    <div className="board-wrap">
      <div className="board-stage">
        <img className="board-img" src={boardSvg} alt="Plateau Sopra Challenge" />

        {/* Zones interactives invisibles pour les clics par thématique */}
        {boardCells.map((cell) => (
          <button
            key={cell.id}
            className={`board-cell ${showDebug ? "board-cell--debug" : ""}`}
            style={{
              left: `${cell.x}%`,
              top: `${cell.y}%`,
              width: `${cell.w}%`,
              height: `${cell.h}%`,
            }}
            onClick={() => onCellClick?.(cell.id)}
          >
            {showDebug && <span className="debug-id">{cell.id}</span>}
          </button>
        ))}

        {/* Rendu des 5 joueurs */}
        {teams.map((player) => {
          const cellPos = boardCells.find(c => c.id === player.currentCell);
          if (!cellPos) return null;

          const offset = getPositionOffset(player.id, player.currentCell);

          return (
            <div
              key={player.id}
              className="pawn"
              style={{
                left: `${cellPos.x}%`,
                top: `${cellPos.y}%`,
                // Ajustement : dy - 25px pour que le pied du pion soit sur la case
                transform: `translate(${offset.x}px, ${offset.y - 25}px)`,
              }}
            >
              <img 
                src={PLAYER_ASSETS[player.color_type]} 
                className="pawn-img" 
                alt={player.name} 
              />
              <span className="pawn-label">{player.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}