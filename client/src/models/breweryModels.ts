import { Brewtroller, BrewtrollerState } from "./brewtrollerModels";

export type Brewery = {
  name: string;
  brewtrollers: Brewtroller[];
};

export interface BreweryState extends Omit<Brewery, "brewtrollers"> {
  state: "ON" | "OFF";
  brewtrollerStates: BrewtrollerState[];
}
