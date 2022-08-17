import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, Response } from "../events";
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
import * as gpioService from "../services/gpioService";

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
        const brewery = repository.GetBreweryState();
        brewery.state = "ON";
        repository.SetBreweryState(brewery);
        StartUpdateLoop();

        // end test

        const result = await repository.InitializeControllers();
        ConfigureBrewtrollers();
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
    ShutdownBrewery();
    StopUpdateLoop();
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

  const getSensors = async (payload: any, acknowledgement: (res: Response<string[]>) => void) => {
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
      const currentBrewtrollerState = repository.GetBrewtrollerState(payload.id);
      if (currentBrewtrollerState === undefined) throw new Error("Brewtroller not found");
      const newOb = { ...currentBrewtrollerState, ...payload };
      const updatedBrewtrollerState = await brewtrollerService.UpdateController(newOb);
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
      repository.SetBrewtrollerState(await brewtrollerService.UpdateController(brewtroller));
    });
  };

  const EmitBrewtrollerStates = async () => {
    const brewtrollerStates = await repository.GetBreweryState();
    io.emit("brew:update", brewtrollerStates);
  };

  const ShutdownBrewery = () => {
    repository.PowerOff();
  };

  const StartUpdateLoop = () => {
    if (updateIntervalTimer === null) updateIntervalTimer = setInterval(UpdateLoop, 1000);
  };

  const StopUpdateLoop = () => {
    if (updateIntervalTimer !== null) {
      clearInterval(updateIntervalTimer);
      updateIntervalTimer = null;
    }
    EmitBrewtrollerStates();
  };

  const ConfigureBrewtrollers = () => {
    const brewtrollers = repository.BrewtrollerStates();
    brewtrollers.forEach((brewtroller) => {
      if (brewtroller.heaterPin == "NA") return;
      gpioService.SetupPin(brewtroller.heaterPin, gpioService.PinMode.PWM);
    });
  };

  //crud
  socket.on("controller:list", getControllerList);
  socket.on("sensor:getAll", getSensors);

  //state
  socket.on("brew:start", startBrewery);
  socket.on("brew:stop", StopBrewery);
  socket.on("brew:adjust", makeAdjustment);
  //socket.on("disconnect", shutdownRepository);

  socket.emit("brew:initialState", repository.GetBreweryState());

  return StopBrewery;
};
