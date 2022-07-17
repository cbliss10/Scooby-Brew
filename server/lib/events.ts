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
  // CRUD controllers
  "controller:list": (
    payload: any,
    acknowledgement: (res: Response<BrewController[]>) => void
  ) => void;
  "controller:update": (
    controllers: BrewController,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "controller:add": (
    controllers: Omit<BrewController, "id">,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "controller:delete": (
    controllerId: string,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "sensor:getAll": (
    payload: any,
    acknowledgement: (res: Response<string[]>) => void
  ) => void;

  // Brewing events
  "brew:adjust": (
    adjustmentData: PowerLevelAdjustmentData,
    acknowledgement: (res?: Response<PowerLevelAdjustmentData>) => void
  ) => void;
  "brew:start": (
    payload: any,
    acknowledgement: (res?: Response<BrewController[]>) => void
  ) => void;
}
