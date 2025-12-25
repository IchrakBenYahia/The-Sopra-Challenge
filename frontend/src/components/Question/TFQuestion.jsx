import React, { useEffect, useRef, useState } from "react";
import "../../styles/Question/QuestionScreen.css";

export default function TFQuestion({ level, onBack, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null); // true/false
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
      if (selected === null) onTimeUp?.();
    }
  }, [timeLeft, selected, onTimeUp]);

  const formatTime = (t) => `00:${String(Math.max(0, t)).padStart(2, "0")}`;

  const choose = (val) => {
    setSelected(val);
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

        <div className="qs-answers qs-answers--tf">
          <button
            className={`qs-answer ${selected === true ? "qs-answer--selected" : ""}`}
            onClick={() => choose(true)}
          >
            <span className="qs-text">VRAI</span>
          </button>

          <button
            className={`qs-answer ${selected === false ? "qs-answer--selected" : ""}`}
            onClick={() => choose(false)}
          >
            <span className="qs-text">FAUX</span>
          </button>
        </div>

        <button className="qs-back" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
}
