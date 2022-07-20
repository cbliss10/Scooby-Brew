import { EventEmitter } from "node:events";
import {
  BrewControllerState,
  ControllerId,
  ControllerTemperature,
} from "../models/controllerModels";
import * as sensorService from "../services/sensorService";

export class ControllerStateController {
  id: ControllerId = "";
  name: string = "";
  description: string = "";
  heaterPin: number | "NA" = "NA";
  sensorAddress: string = "";
  temperature: ControllerTemperature = "--";
  powerLevel: number = 0;
  emitter = new EventEmitter().on("temp-change", this.UpdatePid);

  async GetTemperature(): Promise<number> {
    const temp = await sensorService.GetTemperature(this.sensorAddress);
    this.temperature = temp;
    this.emitter.emit("temp-change", this);
    return this.temperature;
  }

  SetController(controller: BrewControllerState) {
    this.id = controller.id;
    this.name = controller.name;
    this.powerLevel = controller.powerLevel;
    this.heaterPin = controller.heaterPin;
    this.sensorAddress = controller.sensorAddress;
    this.temperature = controller.temperature;
    this.description = controller.description;
  }

  UpdatePid(caller: ControllerStateController) {
    console.log(`update pid for ${caller.name}`);
  }
}
