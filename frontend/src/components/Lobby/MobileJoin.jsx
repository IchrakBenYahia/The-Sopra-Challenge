// src/components/Lobby/MobileJoin.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import PawnSelection from './PawnSelection';
import "../../styles/Lobby/MobileJoin.css";


const MobileJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  // Étape 1 = Code, Étape 2 = Pseudo + Avatar, Étape 3 = Salle d'attente
  const [step, setStep] = useState(1);
 
  const [formData, setFormData] = useState({
    gameCode: '',
    nickname: '',
    avatarColor: ''
  });


  useEffect(() => {
    // Si code dans l'URL (via QR)
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setFormData(prev => ({ ...prev, gameCode: codeFromUrl }));
      setStep(2);
    }


    // --- ÉCOUTEURS SOCKET ---


    // 1. Succès de la connexion : On passe en SALLE D'ATTENTE (Step 3)
    socket.on('join_success', (data) => {
        console.log("Rejoint avec succès !");
        setStep(3); // ✅ On change l'écran pour dire "Attends le chef"
    });


    socket.on('error_message', (msg) => {
        alert("Oups : " + msg);
    });


    // 2. Le jeu commence : On va vers l'écran de QUESTION (Manette)
// Dans MobileJoin.jsx
    socket.on('game_started', (data) => {
      // ⚠️ ATTENTION : On redirige vers /mobile/game/CODE
      navigate(`/mobile/game/${data.gameCode}`, {
        state: {
          gameCode: data.gameCode,
          nickname: formData.nickname,
          avatarColor: formData.avatarColor
        }
      });
    });
    return () => {
      socket.off('join_success');
      socket.off('error_message');
      socket.off('game_started');
    };
  }, [searchParams, navigate, formData.nickname, formData.avatarColor]);


  const handleEnterCode = () => {
    if (formData.gameCode.length >= 4) {
      setStep(2);
    } else {
      alert("Le code doit faire au moins 4 caractères");
    }
  };


  const handleJoinGame = () => {
    if (formData.nickname && formData.avatarColor) {
      // Envoi au serveur
      socket.emit('join_room', {
        gameCode: formData.gameCode,
        nickname: formData.nickname,
        avatarColor: formData.avatarColor
      });
    }
  };


  return (
    <div className="mobile-container">
      {/* Décorations */}
      <div className="decor sunburst-top-right"></div>
      <div className="decor spikes-bottom-left"></div>
      <div className="decor triangle-top-left"></div>
      <div className="decor center-triangle"></div>


      <header className="mobile-header">
        <h1>THE SOPRA CHALLENGE</h1>
      </header>


      {/* --- ÉTAPE 1 : SAISIE DU CODE --- */}
      {step === 1 && (
        <div className="step-box fade-in">
          <label className="input-label">ENTRER LE CODE DE LA PARTIE</label>
          <input
            type="text"
            className="game-input pill-shape"
            placeholder="EX: 3DGT4H"
            value={formData.gameCode}
            onChange={(e) => setFormData({...formData, gameCode: e.target.value.toUpperCase()})}
          />
          <button className="action-btn" onClick={handleEnterCode}>VALIDER</button>
        </div>
      )}


      {/* --- ÉTAPE 2 : CHOIX PSEUDO & PION --- */}
      {step === 2 && (
        <div className="step-box fade-in" style={{ width: '100%', height: '100%' }}>
          <PawnSelection
            playerName={formData.nickname || "JOUEUR"}
            selectedColor={formData.avatarColor}
            onSelect={(color) => setFormData({...formData, avatarColor: color})}
          />


          <div style={{ marginTop: '20px', width: '100%', maxWidth: '300px', zIndex: 20 }}>
             <input
                type="text"
                className="game-input pill-shape"
                placeholder="TON PSEUDO"
                maxLength={12}
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                style={{ textAlign: 'center', border: '2px solid #000' }}
              />
          </div>


          <button
            className="action-btn join-btn"
            onClick={handleJoinGame}
            disabled={!formData.nickname || !formData.avatarColor}
            style={{ position: 'relative', zIndex: 20, marginTop: '15px' }}
          >
            C'EST PARTI !
          </button>
        </div>
      )}


      {/* --- ✅ ÉTAPE 3 : SALLE D'ATTENTE (NOUVEAU) --- */}
      {step === 3 && (
        <div className="step-box fade-in" style={{ textAlign: "center", color: "white" }}>
            <h2 style={{ fontSize: "2rem", textTransform: "uppercase", marginBottom: "10px" }}>
                Bienvenue {formData.nickname} !
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
                Tu es bien connecté à la salle <strong>{formData.gameCode}</strong>.
            </p>
           
            <div className="loading-spinner" style={{
                width: "50px", height: "50px",
                border: "5px solid rgba(255,255,255,0.3)",
                borderTop: "5px solid white",
                borderRadius: "50%",
                margin: "0 auto 20px auto",
                animation: "spin 1s linear infinite"
            }}></div>


            <p>L'animateur va lancer la partie...</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "10px" }}>Regarde le grand écran !</p>


            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
      )}


    </div>
  );
};


export default MobileJoin;

