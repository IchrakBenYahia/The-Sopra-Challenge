import React, { useEffect, useRef, useState } from "react";
import "../../styles/Question/QuestionScreen.css";

export default function OpenQuestion({ level, onBack, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [text, setText] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
      if (text.trim().length === 0) onTimeUp?.();
    }
  }, [timeLeft, text, onTimeUp]);

  const formatTime = (t) => `00:${String(Math.max(0, t)).padStart(2, "0")}`;

  const submit = () => {
    if (text.trim().length === 0) return;
    clearInterval(intervalRef.current);
    // plus tard: envoyer vers écran correction / suivant
  };

  return (
    <div className="qs-screen">
      <div className="qs-bg" />
      <div className="qs-timer">{formatTime(timeLeft)}</div>

      <div className="qs-content">
        <div className="qs-toprow">
          <div className="qs-level">{level}</div>
          <div className="qs-question">{/* Question vide */}</div>
        </div>

        <div className="qs-open">
          <textarea
            className="qs-input"
            placeholder="Tape ta réponse ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </div>

        <div className="qs-footer">
          <button className="qs-back" onClick={onBack}>
            Retour
          </button>

          <button className="qs-validate" onClick={submit} disabled={text.trim().length === 0}>
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
