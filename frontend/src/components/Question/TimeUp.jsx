import React from "react";
import "../../styles/Question/TimeUp.css";

export default function TimeUp({ onRestart }) {
  return (
    <div className="timeup-screen">
      <div className="timeup-card">
        <div className="timeup-title">Temps écoulé !</div>
        <div className="timeup-sub">Aucune réponse sélectionnée.</div>

        <button className="timeup-btn" onClick={onRestart}>
          Revenir au choix
        </button>
      </div>
    </div>
  );
}

