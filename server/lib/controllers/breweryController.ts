import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, Response } from "../events";
import { Brewtroller, BrewtrollerState, BrewtrollerStateDto } from "../models/brewtrollerModels";
import { GetAvailableSensors } from "../services/sensorService";
import { sanitizeErrorMessage } from "../util";
import * as brewtrollerService from "../services/brewtrollerService";
import * as gpioService from "../services/gpioService";
import { BreweryDto, BreweryState } from "../models/breweryModels";
import {
  GetBrewery,
  GetBreweryState,
  GetBrewtroller,
  GetBrewtrollers,
  SetBreweryState,
  SetBrewtrollerState,
} from "../repositories/breweryRepository";

let isActive = false;
let updateIntervalTimer: NodeJS.Timer | null = null;

export const RegisterBreweryHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  const startBrewery = async (payload: any, callback: (res?: BreweryDto) => void) => {
    try {
      if (!isActive) {
        isActive = true;
        const breweryState = GetBreweryState();
        breweryState.mode = "On";
        SetBreweryState(breweryState);
        StartUpdateLoop();

        const brewery = GetBrewery();

        InitializeControllers(Array.from(brewery.brewtrollers.values()));
        ConfigureBrewtrollers();
        const result = GetBreweryState();
        callback(result);
      } else {
        const result = GetBreweryState();
        callback(result);
      }
    } catch (err) {}
  };

  const StopBrewery = async (payload: any, callback: (res?: BreweryDto) => void) => {
    ShutdownBrewery();
    StopUpdateLoop();
    isActive = false;
    callback(GetBreweryState());
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
    payload: BrewtrollerStateDto,
    acknowledgement: (res: BreweryDto) => void
  ) => {
    try {
      const currentBrewtrollerState = GetBrewtroller(payload.id);
      if (currentBrewtrollerState === undefined) throw new Error("Brewtroller not found");
      const newOb = { ...currentBrewtrollerState, ...payload };
      const updatedBrewtrollerState = await brewtrollerService.UpdateController(newOb);
      const response = SetBrewtrollerState(updatedBrewtrollerState);
      if (response === undefined) throw new Error("Error setting brewtroller");
      acknowledgement(GetBreweryState());
    } catch (err) {
      console.log(err);
    }
  };

  const UpdateLoop = () => {
    UpdateBrewtrollers();
    EmitBrewtrollerStates();
  };

  const UpdateBrewtrollers = () => {
    GetBreweryState().brewtrollerDtos.forEach(async (brewtrollerState) => {
      const brewtroller = GetBrewtroller(brewtrollerState.id);
      if (brewtroller === undefined) return;
      SetBrewtrollerState(await brewtrollerService.UpdateController(brewtroller));
    });
  };

  const EmitBrewtrollerStates = async () => {
    const brewtrollerStates = await GetBreweryState();
    io.emit("brew:update", brewtrollerStates);
  };

  const ShutdownBrewery = () => {
    //repository.PowerOff();
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
    const brewtrollers = GetBrewtrollers();
    brewtrollers.forEach((brewtroller) => {
      if (brewtroller.outputPin < 0) return;
      gpioService.SetupPin(brewtroller.outputPin, gpioService.PinMode.PWM);
    });
  };

  //crud
  socket.on("controller:list", getControllerList);
  socket.on("sensor:getAll", getSensors);

  //state
  socket.on("brew:start", startBrewery);
  socket.on("brew:stop", StopBrewery);
  socket.on("brew:update", makeAdjustment);
  //socket.on("disconnect", shutdownRepository);

  socket.emit("brew:initialState", GetBreweryState());

  return StopBrewery;
};
const InitializeControllers = (brewtrollers: Brewtroller[]) => {};
