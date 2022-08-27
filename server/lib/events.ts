import { ValidationErrorItem } from "joi";
import { BreweryDto, BreweryState } from "./models/breweryModels";
import { Brewtroller, BrewtrollerState, BrewtrollerStateDto } from "./models/brewtrollerModels";

interface Success<T> {
  data: T;
}

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

export type Response<T> = Error | Success<T>;

export interface ServerToClientEvents {
  "brew:update": (state: BreweryDto) => void;
  "brew:initialState": (state: BreweryDto) => void;
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
    controllerId: number,
    acknowledgement: (res?: Response<void>) => void
  ) => void;
  "sensor:getAll": (payload: any, acknowledgement: (res: Response<string[]>) => void) => void;

  // Brewing events
  "brew:update": (
    updatedBrewtrollerState: BrewtrollerStateDto,
    acknowledgement: (res?: BreweryDto) => void
  ) => void;
  "brew:start": (payload: any, acknowledgement: (res?: BreweryDto) => void) => void;
  "brew:stop": (payload: any, acknowledgement: (res?: BreweryDto) => void) => void;
}
