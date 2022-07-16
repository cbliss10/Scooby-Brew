import { v4 as uuid } from "uuid";
export type ControllerId = string;

export class BrewController {
  id: ControllerId = uuid();
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
}

export type ControllerTemperature = number | "--";

export class BrewControllerState {
  id: ControllerId = "";
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
}

export interface PowerLevelAdjustmentData {
  id: ControllerId;
  powerLevel: number;
}

export interface UpdateDto {
  id: ControllerId;
  temperature: ControllerTemperature;
  powerLevel: number;
}
