// frontend/src/socket.js
import { io } from 'socket.io-client';

// REMPLACEZ '192.168.1.25' PAR VOTRE VRAIE ADRESSE IP TROUVÉE À L'ÉTAPE 2
const URL = "http://localhost:3001"; 

export const socket = io(URL, {
  autoConnect: true
});