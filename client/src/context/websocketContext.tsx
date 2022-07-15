import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../../server/lib/events";
import { Socket, io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
// const ENDPOINT = "http://192.168.1.11:3001";
const ENDPOINT = "http://localhost:3001";

interface IWebSocketContext {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  status: "Not Connected" | "Connected" | "Connecting";
}

const initialContext: IWebSocketContext = {
  socket: undefined,
  status: "Not Connected",
};

export const WebSocketContext =
  createContext<IWebSocketContext>(initialContext);

interface Props {
  children: React.ReactNode;
}

export function WebSocketContextProvider({ children }: Props) {
  const [webSocketState, setWebSocketState] =
    useState<IWebSocketContext>(initialContext);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
      io(ENDPOINT);
    socket.on("connect", () => {
      console.log(`Connected to websocket with id ${socket.id}`);
      setWebSocketState({ socket, status: "Connected" });
    });
    setWebSocketState({ socket: socket, status: "Connecting" });
  }, []);

  useEffect(() => {}, [webSocketState]);

  return (
    <WebSocketContext.Provider value={webSocketState}>
      {children}
    </WebSocketContext.Provider>
  );
}
