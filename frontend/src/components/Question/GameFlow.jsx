import React, { useState, useEffect } from "react";
import QuestionChoice from "./QuestionChoice";
import QuestionRouter from "./QuestionRouter";
import TimeUp from "./TimeUp";
import { API_URL } from "../../config";
export default function GameFlow() {
  const [screen, setScreen] = useState("choice");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [question, setQuestion] = useState(null);
  const [carteId, setCarteId] = useState(null);
  const [theme, setTheme] = useState(null);

  // 🔹 Charger thème + carte UNE SEULE FOIS
  useEffect(() => {
    fetch(`${API_URL}/cartes/random`)
      .then(res => res.json())
      .then(data => {
        setCarteId(data.id);
        setTheme({
          name: data.theme_nom,
          subtitle: data.carte_titre,
          color: data.theme_couleur
        });
      });
  }, []);

if (!theme || !carteId) {
  return <div>Chargement...</div>;
}

  const goChoice = () => {
    setScreen("choice");
    setQuestion(null);
  };

const startQuestion = async (level) => {
  const typesRes = await fetch(
    `${API_URL}/questions/types?carteId=${carteId}&niveau=${level}`
  );

  const types = await typesRes.json();

  if (types.length === 0) {
    alert("Aucune question pour ce niveau");
    return;
  }

  const type = types[Math.floor(Math.random() * types.length)];

  const res = await fetch(
    `${API_URL}/questions/random?carteId=${carteId}&niveau=${level}&type=${type}`
  );

  const data = await res.json();
  setQuestion(data);
  setScreen("question");
};

  return (
    <>
      {screen === "choice" && (
        <QuestionChoice
          theme={theme}
          onSelectLevel={startQuestion}
        />
      )}

      {screen === "question" && question && (
        <QuestionRouter
          question={question}
          onBack={goChoice}
          onTimeUp={() => setScreen("timeup")}
        />
      )}

      {screen === "timeup" && <TimeUp onRestart={goChoice} />}
    </>
  );
}
