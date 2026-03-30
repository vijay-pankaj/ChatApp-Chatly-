import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  socket = io();
  return socket;
};

export const getSocket = () => socket;

