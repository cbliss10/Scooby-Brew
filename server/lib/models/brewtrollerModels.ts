import Controller = require("node-pid-controller");

type Temperature = number | "--";
type Mode = "PID" | "Trip" | "On" | "Off";

export class Brewtroller {
  id: number = -1;
  name: string = "Unnamed";
  description: string = "";
  outputPin: number = -1;
  sensorAddress: string = "";
  pid: Controller = new Controller();
  state: BrewtrollerState = new BrewtrollerState();
  temperature: Temperature = "--";
  powerLevel: number = 0;
  targetTemperature: Temperature = "--";
  mode: any;
}

export class BrewtrollerState extends Brewtroller {
  temperature: number | "--" = "--";
  powerLevel: number = 0;
  targetTemperature: number = 150;
  mode: Mode = "Off";
}

export class BrewtrollerStateDto {
  id: number = -1;
  name: string = "Unnamed";
  temperature: number | "--" = "--";
  powerLevel: number = 0;
  targetTemperature: Temperature = 150;
  mode: "PID" | "Trip" | "On" | "Off" = "Off";
}
