import { io } from "socket.io-client";

const socket = new io(process.env.VUE_APP_API_SOCKET_URL);

export const websocket = socket;