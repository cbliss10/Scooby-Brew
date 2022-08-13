import Controller = require("node-pid-controller");
import { EventEmitter } from "stream";
import { BrewControllerState, BrewtrollerState, Independents } from "../models/brewtrollerModels";
import * as sensorService from "./sensorService";
import * as gpioService from "./gpioService";

const updateEmitter = new EventEmitter();
updateEmitter.on("updated", (updatedController: BrewControllerState) => {
  console.log(`Update event for ${updatedController.name}`);
});

const defaultController: Independents = {
  temperature: "--",
  powerLevel: 0,
  pidController: null,
};

export const UpdateController = async (
  updateRequest: BrewtrollerState
): Promise<BrewtrollerState> => {
  let updatedController: BrewtrollerState = { ...updateRequest };

  if (updatedController.state === "Off") {
    updatedController.temperature = "--";
    updatedController.powerLevel = 0;
  } else {
    updatedController.temperature = await sensorService.GetTemperature(
      updatedController.sensorAddress
    );
    if (updatedController.state === "On") {
      // do nothing?
    }
    if (updatedController.state === "Trip") {
      if (updatedController.temperature >= updatedController.targetTemperature) {
        //updatedController.powerLevel = 0;
        updatedController.state = "PID";
      }
    }
    if (updatedController.state === "PID") {
      if (updatedController.pidController === null) {
        updatedController.pidController = new Controller();
      }
      if (updatedController.pidController.target !== updatedController.targetTemperature)
        updatedController.pidController.setTarget(updatedController.targetTemperature);
      updatedController.powerLevel = updatedController.pidController.update(
        updatedController.temperature
      );
    }
    if (updatedController.heaterPin === "NA") throw new Error("No heater pin assigned");
    else gpioService.PinWrite(updatedController.heaterPin, updatedController.powerLevel);
    console.log("Brewtroller updated!");
  }

  // updatedController.temperature = await sensorService.GetTemperature(
  //   updatedController.sensorAddress
  // );
  //updateEmitter.emit("updated", updatedController);
  return updatedController;
};
