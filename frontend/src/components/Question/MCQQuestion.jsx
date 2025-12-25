import React, { useEffect, useRef, useState } from "react";
import "../../styles/Question/QuestionScreen.css";

export default function MCQQuestion({ level, onBack, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
      if (!selected) onTimeUp?.();
    }
  }, [timeLeft, selected, onTimeUp]);

  const formatTime = (t) => `00:${String(Math.max(0, t)).padStart(2, "0")}`;

  const choose = (k) => {
    setSelected(k);
    clearInterval(intervalRef.current);
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

        <div className="qs-answers">
          {["A", "B", "C", "D"].map((k) => (
            <button
              key={k}
              className={`qs-answer ${selected === k ? "qs-answer--selected" : ""}`}
              onClick={() => choose(k)}
            >
              <span className="qs-letter">{k}.</span>
              <span className="qs-text"></span>
            </button>
          ))}
        </div>

        <button className="qs-back" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
}
