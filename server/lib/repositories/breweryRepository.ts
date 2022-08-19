import {
  BrewController,
  BrewControllerState,
  Brewtroller,
  BrewtrollerState,
  ControllerId,
  PowerLevelAdjustmentData,
} from "../models/brewtrollerModels";
import * as path from "path";
import * as fs from "fs/promises";
import { Brewery, BreweryState } from "../models/breweryModels";
import { off } from "process";

let testDirection: "Up" | "Down" = "Up";

export interface BreweryRepositoryContract {
  SetBreweryState(brewery: BreweryState): void;
  GetBrewtrollerState(id: string): BrewtrollerState | undefined;
  InitializeControllers: () => Promise<BreweryState>;
  BrewtrollerStates: () => BrewtrollerState[];
  DeleteController: (controllerId: ControllerId) => Promise<void>;
  AddController: (newController: Omit<Brewtroller, "id">) => Promise<void>;
  SetBrewtrollerState(brewtroller: BrewtrollerState): BrewtrollerState | undefined;
  GetBreweryState(): BreweryState;
  PowerOff(): void;
}

class BreweryRepository implements BreweryRepositoryContract {
  constructor() {
    this.ReadFromFile();
  }

  SetBreweryState(brewery: BreweryState) {
    this.breweryState = brewery;
  }
  GetBreweryState(): BreweryState {
    return { ...this.breweryState };
  }
  GetBrewtrollerState(id: string): BrewtrollerState | undefined {
    this.breweryState.brewtrollerStates.forEach((brewtroller) => {
      if (brewtroller.id === id) return brewtroller;
    });
    return undefined;
  }

  PowerOff() {
    this.breweryState.state = "OFF";
    this.breweryState.brewtrollerStates = this.breweryState.brewtrollerStates.map((brewtroller) => {
      brewtroller.state = "Off";
      brewtroller.temperature = "--";
      brewtroller.powerLevel = 0;
      return brewtroller;
    });
  }

  private breweryState: BreweryState = {
    name: "New Brewery",
    state: "OFF",
    brewtrollerStates: [],
  };

  //private readonly controllers: Map<ControllerId, BrewtrollerState> = new Map();

  private readonly filePath = path.join(__dirname, "Controllers.json");

  private async ReadFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const obj = JSON.parse(data);
      const brewery: Brewery = obj;
      const initialStates: BrewtrollerState[] = brewery.brewtrollers.map((brewtroller) => {
        let newState = new BrewtrollerState();
        newState = { ...newState, ...brewtroller };
        return newState;
      });
      this.breweryState = { ...this.breweryState, ...brewery, brewtrollerStates: initialStates };
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  }

  public SetBrewtrollerState(updatedBrewtroller: BrewtrollerState): BrewtrollerState | undefined {
    // const res = this.controllers.set(brewtroller.id, brewtroller);
    const newBrewtrollerStates = this.breweryState.brewtrollerStates.map((brewtroller) =>
      brewtroller.id === updatedBrewtroller.id ? updatedBrewtroller : brewtroller
    );
    this.breweryState.brewtrollerStates = newBrewtrollerStates;
    return updatedBrewtroller;
  }

  public BrewtrollerStates(): BrewtrollerState[] {
    return this.breweryState.brewtrollerStates;
  }

  private async WriteToFile(brewery: Brewery): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(brewery));
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }

  async InitializeControllers(): Promise<BreweryState> {
    try {
      await this.ReadFromFile();
      const breweryState = this.breweryState;
      return Promise.resolve(breweryState);
    } catch (error) {
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
      const updatedBrewery: Brewery = { ...this.breweryState, brewtrollers: [] };
      updatedBrewery.brewtrollers.push(saveController);
      await this.WriteToFile(updatedBrewery);
      await this.ReadFromFile();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
  async DeleteController(controllerId: ControllerId): Promise<void> {
    try {
      const newBrewtrollers: Brewtroller[] = this.breweryState.brewtrollerStates.filter(
        (brewtroller) => brewtroller.id === controllerId
      );
      const brewery: Brewery = { ...this.breweryState, brewtrollers: newBrewtrollers };
      await this.WriteToFile(brewery);
      await this.ReadFromFile();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }

  EmergencyShutdown(): void {
    console.log("Shutting down");
  }
}

export const InitializeRepository = (): BreweryRepositoryContract => {
  const repository = new BreweryRepository();
  return repository;
};
