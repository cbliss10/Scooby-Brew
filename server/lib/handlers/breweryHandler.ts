import { Module } from "module";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Response,
} from "../events";
import { BrewController } from "../models/controllerModels";
import { InitializeRepository } from "../repositories/breweryRepository";
import { GetAvailableSensors } from "../services/sensorService";
import { sanitizeErrorMessage } from "../util";

let isActive = false;
const repository = InitializeRepository();

export const RegisterBreweryHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  const startBrewery = async (
    payload: any,
    callback: (res?: Response<BrewController[]>) => void
  ) => {
    try {
      if (!isActive) {
        const result = await repository.InitializeControllers();
        setInterval(runUpdates, 2000);
        isActive = true;
        callback({ data: result });
      } else {
        const result = await repository.GetControllers();
        callback({ data: result });
      }
    } catch (err) {
      return callback({
        error: sanitizeErrorMessage(err),
      });
    }
  };

  const runUpdates = async function () {
    try {
      const stateMap = await repository.GetControllerStates();
      io.emit("brew:update", stateMap);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const getControllerList = async (
    payload: any,
    callback: (res: Response<BrewController[]>) => void
  ) => {
    try {
      callback({
        data: await repository.GetControllers(),
      });
    } catch (e) {
      callback({
        error: sanitizeErrorMessage(e),
      });
    }
  };

  const getSensors = async (
    payload: any,
    callback: (res: Response<string[]>) => void
  ) => {
    try {
      const ids = await GetAvailableSensors();
      callback({ data: ids });
    } catch (err) {
      callback({ error: sanitizeErrorMessage(err) });
    }
  };

  socket.on("brew:start", startBrewery);
  socket.on("controller:list", getControllerList);
  socket.on("sensor:getAll", getSensors);
};
