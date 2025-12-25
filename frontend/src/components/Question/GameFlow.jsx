import React, { useState } from "react";
import QuestionChoice from "./QuestionChoice";
import QuestionRouter from "./QuestionRouter";
import TimeUp from "./TimeUp";

export default function GameFlow() {
  const [screen, setScreen] = useState("choice"); // "choice" | "question" | "timeup"
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questionType, setQuestionType] = useState(null); // "mcq" | "tf" | "open"

  const theme = { name: "Recrutement", subtitle: "L'entretien" };

  const goChoice = () => {
    setSelectedLevel(null);
    setQuestionType(null);
    setScreen("choice");
  };

  const startQuestion = (level) => {
    setSelectedLevel(level);

    // ✅ Choix du type (aléatoire)
    const types = ["mcq", "tf", "open"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setQuestionType(randomType);

    setScreen("question");
  };

  return (
    <>
      {screen === "choice" && (
        <QuestionChoice theme={theme} onSelectLevel={startQuestion} />
      )}

      {screen === "question" && (
        <QuestionRouter
          type={questionType}
          level={selectedLevel}
          onBack={goChoice}
          onTimeUp={() => setScreen("timeup")}
        />
      )}

      {screen === "timeup" && <TimeUp onRestart={goChoice} />}
    </>
  );
}
