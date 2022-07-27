import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { RegisterBreweryHandlers } from "./controllers/breweryController";
import { InitializeRepository } from "./repositories/breweryRepository";

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

const repository = InitializeRepository();

let clientCount = 0;

const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  clientCount++;

  console.log(clientCount);
  //console.log(io.sockets.clients());

  const shutdown = RegisterBreweryHandlers(io, socket, repository);

  socket.on("disconnect", () => {
    clientCount--;
    console.log(clientCount);
    //console.log(Object.keys(io.sockets.sockets).length);
    if (clientCount < 1) {
      console.log("emergency shutdown in 5 seconds.");
      setTimeout(() => {
        if (clientCount > 0) {
          console.log("Shutdown aborted");
        } else {
          console.log("Shutting down");
          shutdown(null, () => {});
        }
      }, 5000);
    }
  });
};

io.on("connection", onConnection);

httpServer.listen(3001);
