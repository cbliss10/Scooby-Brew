import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { RegisterBreweryHandlers } from "./controllers/breweryController";
import { InitializeRepository } from "./repositories/breweryRepository";

const httpServer = createServer();
const serverOptions = {
  cors: {
    origin: [/^http:\/\/192.168.1./],
    //origin: "http://localhost:3000",
  },
};

const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  httpServer,
  serverOptions
);

const repository = InitializeRepository();

let clientCount = 0;

const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  clientCount++;

  RegisterBreweryHandlers(io, socket, repository);

  socket.on("disconnect", () => {
    clientCount--;
    console.log(clientCount);
    if (clientCount < 1) {
      console.log("emergency shutdown in 30 seconds.");
      setTimeout(() => {
        console.log("starting emergency shutdown.");
        repository.EmergencyShutdown();
      }, 30000);
    }
  });
};

io.on("connection", onConnection);

httpServer.listen(3001);
