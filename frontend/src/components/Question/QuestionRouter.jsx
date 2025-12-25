import React from "react";
import MCQQuestion from "./MCQQuestion";
import TFQuestion from "./TFQuestion";
import OpenQuestion from "./OpenQuestion";

export default function QuestionRouter({ type, level, onBack, onTimeUp }) {
  if (type === "mcq") return <MCQQuestion level={level} onBack={onBack} onTimeUp={onTimeUp} />;
  if (type === "tf") return <TFQuestion level={level} onBack={onBack} onTimeUp={onTimeUp} />;
  if (type === "open") return <OpenQuestion level={level} onBack={onBack} onTimeUp={onTimeUp} />;

  return (
    <div style={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>
      Type inconnu : {String(type)}
    </div>
  );
}
