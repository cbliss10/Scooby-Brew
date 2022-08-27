import { Brewtroller, BrewtrollerStateDto } from "../models/brewtrollerModels";
import * as path from "path";
import * as fs from "fs/promises";
import { Brewery, BreweryDto, BreweryState } from "../models/breweryModels";

const filePath = path.join(__dirname, "Controllers.json");

const brewery: Brewery = {
  name: "Unnamed Brewery",
  brewtrollers: new Map<number, Brewtroller>(),
  mode: "Off",
};

export const GetBrewery = (): Brewery => {
  return { ...brewery };
};

const ReadBreweryFromFile = async (): Promise<Brewery> => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const obj = JSON.parse(data);
    const readBrewery: Brewery = obj;
    return Promise.resolve(readBrewery);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
};

export const InitializeBrewery = async () => {
  const result = await ReadBreweryFromFile();
  brewery.name = result.name;
  brewery.brewtrollers = result.brewtrollers;
};

export const GetBreweryState = (): BreweryDto => {
  const state: BreweryDto = {
    name: brewery.name,
    mode: brewery.mode,
    brewtrollerDtos: Array.from(brewery.brewtrollers.values()).map<BrewtrollerStateDto>(
      (brewtroller) => {
        // todo: implement automapper
        const brewtrollerState = new BrewtrollerStateDto();
        brewtrollerState.id = brewtroller.id;
        brewtrollerState.name = brewtroller.name;
        brewtrollerState.temperature = brewtroller.temperature;
        brewtrollerState.powerLevel = brewtroller.powerLevel;
        brewtrollerState.targetTemperature = brewtroller.targetTemperature;
        brewtrollerState.mode = brewtroller.mode;
        return brewtrollerState;
      }
    ),
  };
  return state;
};

export const SetBreweryState = (updatedState: BreweryDto) => {
  brewery.mode = updatedState.mode;
  updatedState.brewtrollerDtos.map((brewtrollerDto) => {
    const oldState = brewery.brewtrollers.get(brewtrollerDto.id);
    if (oldState === undefined) throw new Error("brewtroller not found");
    brewery.brewtrollers.set(brewtrollerDto.id, { ...oldState, ...brewtrollerDto });
  });
};

export const SetBrewtrollerState = (updatedState: BrewtrollerStateDto) => {
  const currentBrewtroller = brewery.brewtrollers.get(updatedState.id);
  if (currentBrewtroller === undefined)
    throw new Error("Can not set brewtroller state: brewtroller id not found.");

  brewery.brewtrollers.set(updatedState.id, { ...currentBrewtroller, ...updatedState });
};

export const GetBrewtroller = (id: number): Brewtroller | undefined => {
  const brewtroller = brewery.brewtrollers.get(id);
  if (brewtroller === undefined) return undefined;
  return { ...brewtroller };
};

export const GetBrewtrollers = (): Brewtroller[] => {
  return Array.from(brewery.brewtrollers.values());
};
