import {
  BrewController,
  BrewControllerState,
  ControllerId,
  PowerLevelAdjustmentData,
  UpdateDto,
} from "../models/controllerModels";
import * as path from "path";
import * as fs from "fs/promises";
import { GetTemperature } from "../services/sensorService";

let testDirection: "Up" | "Down" = "Up";

class ControllerRepository {
  private readonly controllers: Map<ControllerId, BrewControllerState> =
    new Map();

  private readonly filePath = path.join(__dirname, "Controllers.json");

  private async ReadFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const obj = JSON.parse(data);
      const controllersDto: BrewControllerState[] = obj;
      this.controllers.clear();
      controllersDto.forEach((controller) => {
        const newController = new BrewControllerState();
        this.controllers.set(controller.id, {
          ...newController,
          ...controller,
        });
      });
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  }

  private async WriteToFile(controllers: BrewController[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(controllers));
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }

  private async UpdateStates(): Promise<void> {
    // get controller temperature and set pwm powerLevel here
    try {
      this.controllers.forEach(async (controller) => {
        controller.temperature = await GetTemperature(controller.sensorAddress);
      });
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }

  async GetControllers(): Promise<BrewController[]> {
    const results: BrewController[] = [];
    this.controllers.forEach((controller) => {
      results.push(controller);
    });
    return Promise.resolve(results);
  }

  async InitializeControllers(): Promise<BrewController[]> {
    try {
      await this.ReadFromFile();
      const controllers = Array.from(this.controllers.values());
      return Promise.resolve(controllers);
    } catch (error) {
      return Promise.reject();
    }
  }

  async UpdateController(updatedController: BrewController): Promise<void> {
    try {
      const gotController = this.controllers.get(updatedController.id);
      if (gotController === undefined) throw new Error("controller not found");
      // map properties
      gotController.name = updatedController.name;
      gotController.description = updatedController.description;
      gotController.heaterPin = updatedController.heaterPin;
      gotController.sensorAddress = updatedController.sensorAddress;
      const updatedControllers: BrewController[] = Array.from(
        this.controllers.values()
      );
      await this.WriteToFile(updatedControllers);
      await this.ReadFromFile();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
  async AddController(
    newController: Omit<BrewController, "id">
  ): Promise<void> {
    try {
      // map properties
      const saveController = new BrewController();
      saveController.name = newController.name;
      saveController.description = newController.description;
      saveController.heaterPin = newController.heaterPin;
      saveController.sensorAddress = newController.sensorAddress;
      const updatedControllers: BrewController[] = Array.from(
        this.controllers.values()
      );
      updatedControllers.push(saveController);
      await this.WriteToFile(updatedControllers);
      await this.ReadFromFile();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
  async DeleteController(controllerId: ControllerId): Promise<void> {
    try {
      const newControllers: BrewController[] = [];
      this.controllers.forEach((controller) => {
        if (controller.id !== controllerId) {
          newControllers.push(controller);
        }
      });
      await this.WriteToFile(newControllers);
      await this.ReadFromFile();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
  //   GetController(): Promise<BrewController[]> {}
  async GetControllerStates(): Promise<UpdateDto[]> {
    try {
      await this.UpdateStates();
      const results: UpdateDto[] = [];
      this.controllers.forEach((controller) => {
        results.push({
          id: controller.id,
          powerLevel: controller.powerLevel,
          temperature: controller.temperature,
        });
      });
      return Promise.resolve(results);
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
  SetControllerPower(
    controllerPower: PowerLevelAdjustmentData
  ): Promise<PowerLevelAdjustmentData> {
    const cont = this.controllers.get(controllerPower.id);
    if (cont !== undefined) {
      const updatedControllerState = {
        ...cont,
        powerLevel: controllerPower.powerLevel,
      };
      this.controllers.set(controllerPower.id, updatedControllerState);
      return Promise.resolve(controllerPower);
    }
    return Promise.reject();
  }
}

export const InitializeRepository = () => {
  const repository = new ControllerRepository();
  return repository;
};
