import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Response,
} from "../events";
import {
  BrewController,
  PowerLevelAdjustmentData,
} from "../models/controllerModels";
import { GetAvailableSensors } from "../services/sensorService";
import { sanitizeErrorMessage } from "../util";
import { BreweryRepositoryContract } from "../repositories/breweryRepository";

let isActive = false;

export const RegisterBreweryHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  repository: BreweryRepositoryContract
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
    acknowledgement: (res: Response<string[]>) => void
  ) => {
    try {
      const ids = await GetAvailableSensors();
      acknowledgement({ data: ids });
    } catch (err) {
      acknowledgement({ error: sanitizeErrorMessage(err) });
    }
  };

  const makeAdjustment = async (
    payload: PowerLevelAdjustmentData,
    acknowledgement: (res: Response<PowerLevelAdjustmentData>) => void
  ) => {
    try {
      console.log(`Setting power to ${payload.powerLevel}`);
      const response = await repository.SetControllerPower(payload);
      return acknowledgement({
        data: response,
      });
    } catch (err) {
      return acknowledgement({
        error: sanitizeErrorMessage(err),
      });
    }
  };

  const shutdownRepository = (): void => {
    repository.EmergencyShutdown();
  };

  //crud
  socket.on("controller:list", getControllerList);
  socket.on("sensor:getAll", getSensors);

  //state
  socket.on("brew:start", startBrewery);
  socket.on("brew:adjust", makeAdjustment);
  //socket.on("disconnect", shutdownRepository);
};
