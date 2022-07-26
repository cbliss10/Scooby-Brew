import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Response,
} from "../events";
import {
  AdjustmentData,
  Brewtroller,
  BrewtrollerState,
  PowerLevelAdjustmentData,
} from "../models/brewtrollerModels";
import { GetAvailableSensors } from "../services/sensorService";
import { sanitizeErrorMessage } from "../util";
import { BreweryRepositoryContract } from "../repositories/breweryRepository";
import * as brewtrollerService from "../services/brewtrollerService";

let isActive = false;
let updateInterval = 1;
let updateIntervalTimer: NodeJS.Timer | null = null;
let status: "On" | "Off" = "Off";

export const RegisterBreweryHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  repository: BreweryRepositoryContract
) => {
  const startBrewery = async (
    payload: any,
    callback: (res?: Response<BrewtrollerState[]>) => void
  ) => {
    try {
      if (!isActive) {
        // test

        isActive = true;
        StartUpdateLoop();

        // end test

        const result = await repository.InitializeControllers();
        //setInterval(runUpdates, 2000);
        callback({ data: result });
      } else {
        const result = repository.BrewtrollerStates();
        callback({ data: result });
      }
    } catch (err) {
      return callback({
        error: sanitizeErrorMessage(err),
      });
    }
  };

  const StopBrewery = async (
    payload: any,
    callback: (res?: Response<BrewtrollerState[]>) => void
  ) => {
    StopUpdateLoop();
    ShutdownBrewery();
    isActive = false;
  };

  const getControllerList = async (
    payload: any,
    callback: (res: Response<Brewtroller[]>) => void
  ) => {
    try {
      throw new Error("Not implemented");
      // callback({
      //   data: await repository.GetControllers(),
      // });
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
    payload: AdjustmentData,
    acknowledgement: (res: Response<BrewtrollerState>) => void
  ) => {
    try {
      console.log(`Setting power to ${payload.powerLevel}`);
      const currentBrewtrollerState = repository.GetBrewtrollerState(
        payload.id
      );
      if (currentBrewtrollerState === undefined)
        throw new Error("Brewtroller not found");
      const newOb = { ...currentBrewtrollerState, ...payload };
      const updatedBrewtrollerState = await brewtrollerService.UpdateController(
        newOb
      );
      const response = repository.SetBrewtrollerState(updatedBrewtrollerState);
      if (response === undefined) throw new Error("Error setting brewtroller");
      return acknowledgement({
        data: response,
      });
    } catch (err) {
      return acknowledgement({
        error: sanitizeErrorMessage(err),
      });
    }
  };

  const UpdateLoop = () => {
    UpdateBrewtrollers();
    EmitBrewtrollerStates();
  };

  const UpdateBrewtrollers = () => {
    repository.BrewtrollerStates().forEach(async (brewtroller) => {
      repository.SetBrewtrollerState(
        await brewtrollerService.UpdateController(brewtroller)
      );
    });
  };

  const EmitBrewtrollerStates = async () => {
    const brewtrollerStates = await repository.BrewtrollerStates();
    socket.emit("brew:update", brewtrollerStates);
  };

  const ShutdownBrewery = () => {
    console.log(repository.BrewtrollerStates().length);
    repository.BrewtrollerStates().forEach((brewtroller) => {
      console.log(`Shutting down ${brewtroller.name}`);
    });
  };

  const StartUpdateLoop = () => {
    if (updateIntervalTimer === null)
      updateIntervalTimer = setInterval(UpdateLoop, 1000);
  };

  const StopUpdateLoop = () => {
    if (updateIntervalTimer !== null) {
      clearInterval(updateIntervalTimer);
      updateIntervalTimer = null;
    }
  };

  //crud
  socket.on("controller:list", getControllerList);
  socket.on("sensor:getAll", getSensors);

  //state
  socket.on("brew:start", startBrewery);
  socket.on("brew:stop", StopBrewery);
  socket.on("brew:adjust", makeAdjustment);
  //socket.on("disconnect", shutdownRepository);

  return StopBrewery;
};
