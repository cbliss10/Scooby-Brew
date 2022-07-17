import * as ds18b20 from "ds18b20";
import * as fs from "fs";
import * as mockService from "./mockControllerService";

const isTestMode = !fs.existsSync("C:/sys/bus/w1/devices/w1_slave");
const service = isTestMode ? mockService : ds18b20;

function GetAvailableSensors() {
  return new Promise<string[]>((resolve, reject) => {
    service.sensors((err, ids) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(ids);
    });
  });
}

function GetTemperature(sensorAddress: string) {
  return new Promise<number>((resolve, reject) => {
    if (isTestMode) return resolve(0);
    ds18b20.temperature(sensorAddress, (err, temp) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(temp);
      return resolve(temp);
    });
  });
}

export { GetAvailableSensors, GetTemperature };
