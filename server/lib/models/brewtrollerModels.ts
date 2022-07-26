import Controller = require("node-pid-controller");
import { v4 as uuid } from "uuid";
export type ControllerId = string;

export class BrewController {
  id: ControllerId = uuid();
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
}

export class Brewtroller {
  id: ControllerId = uuid();
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
}

export type ControllerTemperature = number | "--";

export class Independents {
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
  pidController: Controller | null = null;
}

export class BrewControllerState {
  id: ControllerId = "";
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
  pidController: Controller | null = null;
  state: "Auto" | "On" | "Off" = "Off";
}

export class BrewtrollerState extends Brewtroller {
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
  pidController: Controller | null = null;
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
