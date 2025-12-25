// src/components/MobileJoin.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket'; // Import de la connexion serveur
import PawnSelection from '../PawnSelection'; // Import du composant visuel
import './MobileJoin.css';

const MobileJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Étape 1 = Code, Étape 2 = Pseudo + Avatar
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    gameCode: '',
    nickname: '',
    avatarColor: ''
  });

  // Si on scanne le QR code, le code est dans l'URL (?code=XY78)
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setFormData(prev => ({ ...prev, gameCode: codeFromUrl }));
      setStep(2); // On saute directement à l'étape 2
    }

    // Écouteurs Socket.io
    socket.on('join_success', (data) => {
        alert(`Super ! Tu as rejoint la salle ${data.gameCode}. Regarde l'écran !`);
        // Ici, plus tard, on redirigera vers un écran "WaitingRoom"
    });

    socket.on('error_message', (msg) => {
        alert("Erreur : " + msg);
    });

    return () => {
        socket.off('join_success');
        socket.off('error_message');
    };
  }, [searchParams]);

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
      {/* Décorations d'arrière-plan */}
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

          <button className="action-btn" onClick={handleEnterCode}>
            VALIDER
          </button>

          <div className="divider-text">OU</div>

          <div className="scan-link" onClick={() => alert("Fonction scan à implémenter")}>
            SCANNER UN QR CODE
          </div>
        </div>
      )}

      {/* --- ÉTAPE 2 : CHOIX PSEUDO & PION --- */}
      {step === 2 && (
        <div className="step-box fade-in" style={{ width: '100%', height: '100%' }}>
          
          {/* Sélection visuelle du pion */}
          <PawnSelection 
            playerName={formData.nickname || "JOUEUR"}
            selectedColor={formData.avatarColor}
            onSelect={(color) => setFormData({...formData, avatarColor: color})}
          />

          {/* Saisie du pseudo */}
          <div style={{ marginTop: '20px', width: '100%', maxWidth: '300px', zIndex: 20 }}>
             <input 
                type="text" 
                className="game-input pill-shape" 
                placeholder="TON PSEUDO"
                maxLength={12}
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                style={{ 
                  boxShadow: '0 5px 0 #000', 
                  border: '2px solid #000',
                  textAlign: 'center' 
                }} 
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
    </div>
  );
};

export default MobileJoin;