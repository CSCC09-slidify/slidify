import { io } from "socket.io-client";

const socket = new io("http://localhost:3000");

export const websocket = socket;