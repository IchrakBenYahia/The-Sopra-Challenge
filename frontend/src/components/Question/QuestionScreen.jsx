import React, { useEffect, useRef, useState } from "react";
import "../../styles/Question/QuestionScreen.css";

export default function QuestionScreen({ level, onBack, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const intervalRef = useRef(null);

  // Démarrer le chrono à l'arrivée sur l'écran
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    // Nettoyage quand on quitte l'écran
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // Quand le temps arrive à 0
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);

      // si aucune réponse choisie -> page time up
      if (!selectedAnswer) {
        onTimeUp?.();
      }
    }
  }, [timeLeft, selectedAnswer, onTimeUp]);

  const formatTime = (t) => `00:${String(Math.max(t, 0)).padStart(2, "0")}`;

  const chooseAnswer = (letter) => {
    // on enregistre la réponse
    setSelectedAnswer(letter);

    // on stop le chrono dès qu'on clique
    clearInterval(intervalRef.current);

    // pour l’instant on ne change pas d'écran,
    // tu pourras ensuite aller à "correct/wrong"
  };

  return (
    <div className="qs-screen">
      <div className="qs-bg" />

      {/* Timer */}
      <div className="qs-timer">{formatTime(timeLeft)}</div>

      <div className="qs-content">
        {/* Ligne: Niveau + Question */}
        <div className="qs-toprow">
          <div className="qs-level">{level}</div>
          <div className="qs-question">{/* vide */}</div>
        </div>

        {/* Réponses */}
        <div className="qs-answers">
          <button
            className={`qs-answer ${selectedAnswer === "A" ? "qs-answer--selected" : ""}`}
            onClick={() => chooseAnswer("A")}
          >
            <span className="qs-letter">A.</span>
            <span className="qs-text"></span>
          </button>

          <button
            className={`qs-answer ${selectedAnswer === "B" ? "qs-answer--selected" : ""}`}
            onClick={() => chooseAnswer("B")}
          >
            <span className="qs-letter">B.</span>
            <span className="qs-text"></span>
          </button>

          <button
            className={`qs-answer ${selectedAnswer === "C" ? "qs-answer--selected" : ""}`}
            onClick={() => chooseAnswer("C")}
          >
            <span className="qs-letter">C.</span>
            <span className="qs-text"></span>
          </button>

          <button
            className={`qs-answer ${selectedAnswer === "D" ? "qs-answer--selected" : ""}`}
            onClick={() => chooseAnswer("D")}
          >
            <span className="qs-letter">D.</span>
            <span className="qs-text"></span>
          </button>
        </div>

        {/* Bouton retour */}
        <button className="qs-back" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
}
