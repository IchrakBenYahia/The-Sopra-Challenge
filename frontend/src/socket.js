import { io } from "socket.io-client"; // <-- IMPORTANT
import { API_URL } from './config';

export const socket = io(API_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"], // <-- ajoute polling comme fallback
  upgrade: true
});
