import { SensorsCallback, TemperatureCallback } from "ds18b20";

const availableSensors = ["aaaaaa", "bbbbbb", "cccccc"];
const sensorTemp = [0, 0, 0];

export const sensors = (callback: SensorsCallback) => {
  callback(null, availableSensors);
};

export const temperature = (address: string, callback: TemperatureCallback) => {
  const index = availableSensors.indexOf(address);
  if (index === -1) {
    return callback(new Error("Sensor not found."), 0);
  }
  sensorTemp[index]++;
  return callback(null, sensorTemp[index]);
};
