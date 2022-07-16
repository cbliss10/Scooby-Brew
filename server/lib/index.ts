import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { RegisterBreweryHandlers } from "./handlers/breweryHandler";

const httpServer = createServer();
const serverOptions = {
  cors: {
    //origin: [/^http:\/\/192.168.1./],
    origin: "http://localhost:3000",
  },
};

const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  httpServer,
  serverOptions
);

const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  RegisterBreweryHandlers(io, socket);
};

io.on("connection", onConnection);

httpServer.listen(3001);
