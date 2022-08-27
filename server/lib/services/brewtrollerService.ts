import Controller = require("node-pid-controller");
import { EventEmitter } from "stream";
import { Brewtroller, BrewtrollerState, BrewtrollerStateDto } from "../models/brewtrollerModels";
import * as sensorService from "./sensorService";
import * as gpioService from "./gpioService";

export const UpdateController = async (updateRequest: Brewtroller): Promise<Brewtroller> => {
  let updatedController: Brewtroller = { ...updateRequest };

  updatedController.temperature = await sensorService.GetTemperature(
    updatedController.sensorAddress
  );
  if (updatedController.mode === "Off") {
    //updatedController.temperature = "--";
    updatedController.powerLevel = 0;
  } else {
    if (updatedController.mode === "On") {
      // do nothing?
    }
    if (updatedController.mode === "Trip") {
      if (updatedController.temperature >= updatedController.targetTemperature) {
        //updatedController.powerLevel = 0;
        updatedController.mode = "PID";
      }
    }
    if (updatedController.mode === "PID") {
      if (updateRequest.pid === null) {
        updateRequest.pid = new Controller();
      }
      if (
        updatedController.pid.target !== updatedController.targetTemperature &&
        updatedController.targetTemperature !== "--"
      )
        updatedController.pid.setTarget(updatedController.targetTemperature);
      updatedController.powerLevel = updatedController.pid.update(updatedController.temperature);
    }
    if (updatedController.outputPin < 0) throw new Error("No heater pin assigned");
    else gpioService.PinWrite(updatedController.outputPin, updatedController.powerLevel);
    console.log("Brewtroller updated!");
  }

  // updatedController.temperature = await sensorService.GetTemperature(
  //   updatedController.sensorAddress
  // );
  //updateEmitter.emit("updated", updatedController);
  return updatedController;
};
