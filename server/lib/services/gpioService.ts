//import * as ds18b20 from "ds18b20";
import * as fs from "fs";
import * as mockService from "./mockControllerService";
import * as rpio from "rpio";
import { PWM } from "rpio";

const isTestMode = !fs.existsSync("C:/sys/bus/w1/devices/w1_slave");
//const service = isTestMode ? mockService : ds18b20;
if (isTestMode)
  rpio.init({
    mock: "raspi-3",
    gpiomem: false,
  });
else rpio.init({ gpiomem: false });

const defaultClockDivider = 64;
const defaultRange = 100;

const configuredPins: Map<number, PinMode> = new Map<number, PinMode>();

export const SetupPin = (pin: number, mode: PinMode, options: GpioOptions = new GpioOptions()) => {
  try {
    if (configuredPins.has(pin)) {
      console.log(`Re-assigning pin ${pin} in ${mode.toString()} mode`);
      rpio.mode(pin, mode);
      configuredPins.set(pin, mode);
    } else {
      console.log(`Setting up pin ${pin} in ${mode.toString()} mode`);
      rpio.open(pin, mode.valueOf());
      configuredPins.set(pin, mode);
    }
    if (mode === PWM) {
      rpio.pwmSetClockDivider(options.ClockDivider);
      rpio.pwmSetRange(pin, options.Range);
    }
  } catch (error) {
    console.log(error);
  }
};

export const PinWrite = (pin: number, data: "High" | "Low" | number) => {
  const mode = configuredPins.get(pin);
  if (mode === undefined) throw new Error("Pin not configured.");
  switch (mode) {
    case PinMode.PWM:
      if (data === "High") rpio.pwmSetData(pin, 100);
      else if (data === "Low") rpio.pwmSetData(pin, 0);
      else rpio.pwmSetData(pin, data);
      break;
    case PinMode.Read:
      throw new Error("Cannont write to pin set in read mode");
    case PinMode.Write:
      if (data === "High") rpio.write(pin, rpio.HIGH);
      else if (data === "Low") rpio.write(pin, rpio.LOW);
      else throw new Error("Pins in write mode can only be high or low");
      break;
    default:
      throw new Error("Invalid pin mode detected.");
  }
};

export enum PinMode {
  Read = 0,
  Write = 1,
  PWM = 2,
}

export class GpioOptions {
  ClockDivider = 64;
  Range = 100;
}
