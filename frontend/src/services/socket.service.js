import { io } from "socket.io-client";

const socket = new io("https://backend-app-f3w7geeriq-uc.a.run.app");

export const websocket = socket;
