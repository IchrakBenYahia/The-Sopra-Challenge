import React from "react";
import MCQQuestion from "./MCQQuestion";
import TFQuestion from "./TFQuestion";
import OpenQuestion from "./OpenQuestion";

export default function QuestionRouter({ question, onBack, onTimeUp }) {
  if (question.type === "QCM")
    return <MCQQuestion question={question} onBack={onBack} onTimeUp={onTimeUp} />;

  if (question.type === "VF")
    return <TFQuestion question={question} onBack={onBack} onTimeUp={onTimeUp} />;

  if (question.type === "ouverte")
    return <OpenQuestion question={question} onBack={onBack} onTimeUp={onTimeUp} />;

  return null;
}

