import {
  Brewtroller,
  BrewtrollerState,
  ControllerId,
  PowerLevelAdjustmentData,
} from "../models/brewtrollerModels";
import * as path from "path";
import * as fs from "fs/promises";

let testDirection: "Up" | "Down" = "Up";

export interface BreweryRepositoryContract {
  GetBrewtrollerState(id: string): BrewtrollerState | undefined;
  InitializeControllers: () => Promise<BrewtrollerState[]>;
  //UpdateController: (updatedController: BrewController) => Promise<void>;
  BrewtrollerStates: () => BrewtrollerState[];
  //GetControllers: () => Promise<BrewController[]>;
  SetControllerPower: (
    controllerPower: PowerLevelAdjustmentData
  ) => Promise<PowerLevelAdjustmentData>;
  //GetControllerStates: () => Promise<UpdateDto[]>;
  DeleteController: (controllerId: ControllerId) => Promise<void>;
  AddController: (newController: Omit<Brewtroller, "id">) => Promise<void>;
  SetBrewtrollerState(
    brewtroller: BrewtrollerState
  ): BrewtrollerState | undefined;
}

class BreweryRepository implements BreweryRepositoryContract {
  GetBrewtrollerState(id: string): BrewtrollerState | undefined {
    return this.controllers.get(id);
  }

  PowerOff() {
    //throw new Error("Method not implemented.");
    console.log("Power off method not yet implemented.");
  }
  private readonly controllers: Map<ControllerId, BrewtrollerState> = new Map();

  private readonly filePath = path.join(__dirname, "Controllers.json");

  private async ReadFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const obj = JSON.parse(data);
      const controllersDto: BrewtrollerState[] = obj;
      this.controllers.clear();
      controllersDto.forEach((controller) => {
        const newController = new BrewtrollerState();
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

  public SetBrewtrollerState(
    brewtroller: BrewtrollerState
  ): BrewtrollerState | undefined {
    const res = this.controllers.set(brewtroller.id, brewtroller);
    return res.get(brewtroller.id);
  }

  public BrewtrollerStates(): BrewtrollerState[] {
    return Array.from(this.controllers.values());
  }

  private async WriteToFile(controllers: Brewtroller[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(controllers));
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }

  // private async UpdateStates(): Promise<void> {
  //   // get controller temperature and set pwm powerLevel here
  //   try {
  //     const self = this;
  //     this.controllers.forEach(async (controller) => {
  //       const updatedController = await controllerService.UpdateController(
  //         controller
  //       );
  //       self.controllers.set(controller.id, updatedController);
  //     });
  //     return Promise.resolve();
  //   } catch (err) {
  //     console.log(err);
  //     return Promise.reject();
  //   }
  // }

  // async GetControllers(): Promise<BrewController[]> {
  //   const results: BrewController[] = [];
  //   this.controllers.forEach((controller) => {
  //     results.push(controller);
  //   });
  //   return Promise.resolve(results);
  // }

  async InitializeControllers(): Promise<BrewtrollerState[]> {
    try {
      await this.ReadFromFile();
      const controllers = Array.from(this.controllers.values());
      return Promise.resolve(controllers);
    } catch (error) {
      return Promise.reject();
    }
  }

  async UpdateController(updatedController: Brewtroller): Promise<void> {
    try {
      const gotController = this.controllers.get(updatedController.id);
      if (gotController === undefined) throw new Error("controller not found");
      // map properties
      gotController.name = updatedController.name;
      gotController.description = updatedController.description;
      gotController.heaterPin = updatedController.heaterPin;
      gotController.sensorAddress = updatedController.sensorAddress;
      const updatedControllers: Brewtroller[] = Array.from(
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
  async AddController(newController: Omit<Brewtroller, "id">): Promise<void> {
    try {
      // map properties
      const saveController = new Brewtroller();
      saveController.name = newController.name;
      saveController.description = newController.description;
      saveController.heaterPin = newController.heaterPin;
      saveController.sensorAddress = newController.sensorAddress;
      const updatedControllers: Brewtroller[] = Array.from(
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
      const newControllers: Brewtroller[] = [];
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

  EmergencyShutdown(): void {
    console.log("Shutting down");
  }
}

export const InitializeRepository = (): BreweryRepositoryContract => {
  const repository = new BreweryRepository();
  return repository;
};
