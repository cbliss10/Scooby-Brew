import { ValidationErrorItem } from "joi";
import {
  BrewController,
  BrewControllerState,
  ControllerId,
  PowerLevelAdjustmentData,
  UpdateDto,
} from "./models/controllerModels";

interface Success<T> {
  data: T;
}

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

export type Response<T> = Error | Success<T>;

export interface ServerToClientEvents {
  "brew:update": (state: UpdateDto[]) => void;
}

export interface ClientToServerEvents {
  "controller:list": (
    payload: any,
    callback: (res: Response<BrewController[]>) => void
  ) => void;
  "controller:update": (
    controllers: BrewController,
    callback: (res?: Response<void>) => void
  ) => void;
  "controller:add": (
    controllers: Omit<BrewController, "id">,
    callback: (res?: Response<void>) => void
  ) => void;
  "controller:delete": (
    controllerId: string,
    callback: (res?: Response<void>) => void
  ) => void;
  "brew:adjust": (
    adjustmentData: PowerLevelAdjustmentData,
    callback: (res?: Response<PowerLevelAdjustmentData>) => void
  ) => void;
  "brew:start": (
    data: string,
    callback: (res?: Response<BrewController[]>) => void
  ) => void;
  "sensor:getAll": (
    payload: any,
    callback: (res: Response<string[]>) => void
  ) => void;
}
