// src/components/Game/MobileGame.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { socket } from '../../socket';
import Plateau from '../Board/Plateau'; // On réutilise ton composant Plateau
import GameFlow from '../Question/GameFlow'; // Ton composant Question


const MobileGame = () => {
  const { gameCode } = useParams();
  const location = useLocation();
 
  // Par défaut, le joueur voit le "board" (Plateau)
  const [viewMode, setViewMode] = useState('board');


  useEffect(() => {
    // Si l'animateur dit "C'est ton tour !"
    socket.on('your_turn_to_answer', () => {
      console.log("C'est mon tour !");
      setViewMode('question');
    });


    // Si l'animateur ou le jeu dit "Retour au plateau"
    socket.on('back_to_board', () => {
      console.log("Retour au plateau");
      setViewMode('board');
    });


    return () => {
      socket.off('your_turn_to_answer');
      socket.off('back_to_board');
    };
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#333' }}>
     
      {viewMode === 'board' && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
           {/* On affiche le plateau mais adapté au mobile */}
           {/* L'astuce ici est de masquer les contrôles animateur via CSS ou une prop,
               mais pour l'instant on affiche tout en petit */}
           <div style={{
               transform: 'scale(0.4)',
               transformOrigin: 'top left',
               width: '250%',
               height: '250%',
               pointerEvents: 'none' // Empêche le joueur de cliquer sur le plateau
           }}>
              {/* On passe isMobileView pour masquer les boutons animateurs dans Plateau.jsx */}
              <Plateau isMobileView={true} />
           </div>
           
           {/* Overlay d'information */}
           <div style={{
               position: 'fixed', bottom: 0, left: 0, width: '100%',
               background: 'rgba(0,0,0,0.85)', color: 'white',
               padding: '20px', textAlign: 'center',
               borderTop: '4px solid #FFEB3B',
               zIndex: 9999
           }}>
               <h3 style={{margin: 0, fontSize: '1.2rem'}}>En attente de ton tour...</h3>
               <p style={{margin: '5px 0 0 0', opacity: 0.8}}>Regarde le grand écran !</p>
           </div>
        </div>
      )}


      {viewMode === 'question' && (
        <GameFlow />
      )}


    </div>
  );
};


export default MobileGame;
