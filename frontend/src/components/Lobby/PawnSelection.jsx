import React from 'react';
import "../../styles/Lobby/PawnSelection.css"; 

// Import des 5 images depuis le dossier assets
// Assurez-vous qu'elles sont bien dans src/assets/
import joueur1 from '../../assets/joueur_1.png';
import joueur2 from '../../assets/joueur_2.png';
import joueur3 from '../../assets/joueur_3.png';
import joueur4 from '../../assets/joueur_4.png';
import joueur5 from '../../assets/joueur_5.png';

const PawnSelection = ({ onSelect, selectedColor, playerName }) => {
  
  // Configuration des 5 pions correspondant aux images
  const pawns = [
    { id: 'p1', color: '#2ecc71', label: 'JOUEUR 1', img: joueur1 }, // Vert
    { id: 'p2', color: '#3498db', label: 'JOUEUR 2', img: joueur2 }, // Bleu
    { id: 'p3', color: '#cf022b', label: 'JOUEUR 3', img: joueur3 }, // Rouge (Charte)
    { id: 'p4', color: '#f1c40f', label: 'JOUEUR 4', img: joueur4 }, // Jaune
    { id: 'p5', color: '#8b1d82', label: 'JOUEUR 5', img: joueur5 }  // Violet (Charte)
  ];

  return (
    <div className="pawn-selection-container">
      
      <div className="corner-stripe top-left"></div>
      <div className="corner-stripe bottom-right"></div>

      <h2 className="selection-title">CHOISIS TON PION</h2>

      <div className="pawns-row">
        {pawns.map((pawn) => (
          <div 
            key={pawn.id} 
            // On compare la couleur (ou l'ID) pour savoir lequel est actif
            className={`pawn-card ${selectedColor === pawn.color ? 'active' : ''}`}
            onClick={() => onSelect(pawn.color)}
          >
            <div className="pawn-image-wrapper">
              <img 
                src={pawn.img} 
                alt={`Pion ${pawn.label}`} 
                className="pawn-image" 
              />
            </div>

            <div className="pawn-label">
              {/* Si ce pion est sélectionné, on affiche le pseudo du joueur, sinon le label par défaut */}
              {selectedColor === pawn.color ? (playerName || pawn.label) : pawn.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PawnSelection;