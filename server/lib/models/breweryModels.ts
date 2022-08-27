import { Brewtroller, BrewtrollerState, BrewtrollerStateDto } from "./brewtrollerModels";

export type Brewery = {
  name: string;
  mode: "On" | "Off";
  brewtrollers: Map<number, Brewtroller>;
};

export interface BreweryState extends Omit<Brewery, "brewtrollers"> {
  state: "ON" | "OFF";
  brewtrollerStates: BrewtrollerState[];
}

export class BreweryDto {
  name: string = "Unnamed";
  brewtrollerDtos: BrewtrollerStateDto[] = [];
  mode: "On" | "Off" = "Off";
}
