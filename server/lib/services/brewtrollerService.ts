import { EventEmitter } from "stream";
import {
  BrewControllerState,
  BrewtrollerState,
  Independents,
} from "../models/brewtrollerModels";
import * as sensorService from "./sensorService";

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
    if (updatedController.state === "Trip") {
      if (
        updatedController.temperature >= updatedController.targetTemperature
      ) {
        //updatedController.powerLevel = 0;
        updatedController.state = "PID";
      }
    }
  }

  // updatedController.temperature = await sensorService.GetTemperature(
  //   updatedController.sensorAddress
  // );
  //updateEmitter.emit("updated", updatedController);
  return updatedController;
};
