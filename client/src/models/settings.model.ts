export interface IBrewerySettings {
  units: "F" | "C";
}

export class BrewerySettings implements IBrewerySettings {
  units: "F" | "C" = "F";
}
