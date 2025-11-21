import io ,{ Socket } from "socket.io-client";


let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      path: "/socket.io",
      autoConnect: false,
    });
  }
  return socket;
};
