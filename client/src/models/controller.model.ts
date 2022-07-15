import { v4 as uuid } from "uuid";

export type ControllerId = string;

export interface IBrewController {
  id: ControllerId;
  name: string;
  sensorAddress: string;
  heaterPin: number;
}

export class BrewController implements IBrewController {
  id: string;
  name: string;
  sensorAddress: string;
  powerLevel: number | "NA";
  temperature: number | "NA";
  status: "ON" | "OFF";
  heaterPin: number;

  constructor() {
    this.id = uuid();
    this.name = "Not named";
    this.sensorAddress = "";
    this.powerLevel = "NA";
    this.temperature = "NA";
    this.heaterPin = 0;
    this.status = "OFF";
  }
}
