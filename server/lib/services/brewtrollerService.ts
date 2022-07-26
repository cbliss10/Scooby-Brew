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

  switch (updatedController.state) {
    case "On":
      updatedController.temperature = await sensorService.GetTemperature(
        updatedController.sensorAddress
      );
      break;
    case "Off":
      //updatedController = { ...updatedController, ...defaultController };
      break;
    case "PID":
      break;
    case "Trip":
      break;

    default:
      break;
  }

  updatedController.temperature = await sensorService.GetTemperature(
    updatedController.sensorAddress
  );
  updateEmitter.emit("updated", updatedController);
  return updatedController;
};
