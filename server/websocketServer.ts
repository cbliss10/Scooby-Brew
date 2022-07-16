import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../src/websocket/events";
const mockData = require("./mockData");

const { brewControllers } = mockData;

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: { origin: "*", methods: ["GET", "POST"] },
});
io.on("connection", (socket) => {
  console.log(`Connected to client with id ${socket.id}`);

  socket.on("controller:list", handleCallback);
});

function handleCallback(callback: (res: string) => void) {
  callback("Testing 1,2,3");
}

io.listen(3001);
