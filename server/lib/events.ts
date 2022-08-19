import { ValidationErrorItem } from "joi";
import { BreweryState } from "./models/breweryModels";
import { AdjustmentData, Brewtroller, BrewtrollerState } from "./models/brewtrollerModels";

interface Success<T> {
  data: T;
}

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

export type Response<T> = Error | Success<T>;

export interface ServerToClientEvents {
  "brew:update": (state: BreweryState) => void;
  "brew:initialState": (state: BreweryState) => void;
}

export interface ClientToServerEvents {
  // CRUD controllers
  "controller:list": (
    payload: any,
    acknowledgement: (res: Response<Brewtroller[]>) => void
  ) => void;
  "controller:update": (
    controllers: Brewtroller,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "controller:add": (
    controllers: Omit<Brewtroller, "id">,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "controller:delete": (
    controllerId: string,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "sensor:getAll": (payload: any, acknowledgement: (res: Response<string[]>) => void) => void;

  // Brewing events
  "brew:adjust": (
    adjustmentData: AdjustmentData,
    acknowledgement: (res?: Response<BrewtrollerState>) => void
  ) => void;
  "brew:start": (payload: any, acknowledgement: (res?: BreweryState) => void) => void;
  "brew:stop": (payload: any, acknowledgement: (res?: BreweryState) => void) => void;
}
