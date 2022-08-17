import { v4 as uuid } from "uuid";
export type ControllerId = string;

export class Brewtroller {
  id: ControllerId = uuid();
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
}

export type ControllerTemperature = number | "--";

export class BrewtrollerState extends Brewtroller {
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
  targetTemperature: number = 150;
  state: "PID" | "Trip" | "On" | "Off" = "Off";
}

export interface PowerLevelAdjustmentData {
  id: ControllerId;
  powerLevel: number;
}

export interface AdjustmentData {
  id: ControllerId;
  powerLevel: number;
  targetTemperature: number;
  state: "PID" | "Trip" | "On" | "Off";
}
