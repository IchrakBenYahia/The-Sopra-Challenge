import React from "react";
import "../../styles/Question/QuestionChoice.css";

export default function QuestionChoice({ theme, selectedLevel, onSelectLevel }) {
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="choice-screen">
      <div className="bg-shapes" />

      <div className="choice-container">
        <h2 className="theme-title">{theme.name}</h2>
        <h3 className="theme-subtitle">{theme.subtitle}</h3>

        <div className="levels-grid">
          {levels.map((level) => (
            <button
              key={level}
              className={`level-card ${
                selectedLevel === level ? "level-card--selected" : ""
              }`}
              onClick={() => onSelectLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
