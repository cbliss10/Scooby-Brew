import { SensorsCallback } from "ds18b20";

const availableSensors = ["aaaaaa", "bbbbbb", "cccccc"];

export const sensors = (callback: SensorsCallback) => {
  callback(null, availableSensors);
};
