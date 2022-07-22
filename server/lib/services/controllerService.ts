import { EventEmitter } from "stream";
import { BrewControllerState } from "../models/controllerModels";
import { GetTemperature } from "./sensorService";

const updateEmitter = new EventEmitter();
updateEmitter.on("updated", (updatedController: BrewControllerState) => {
  console.log(`Update event for ${updatedController.name}`);
});

export const UpdateController = async (
  updateRequest: BrewControllerState
): Promise<BrewControllerState> => {
  const updatedController: BrewControllerState = { ...updateRequest };
  updatedController.temperature = await GetTemperature(
    updatedController.sensorAddress
  );
  updateEmitter.emit("updated", updatedController);
  return updatedController;
};
