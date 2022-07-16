import * as SensorService from "./sensorService";
import { expect } from "chai";

describe("Sensor Service", () => {
  it("Should get list of found addresses", async () => {
    let addresses = await SensorService.GetAvailableSensors();
    expect(addresses.length).to.equal(3);
    expect(addresses).to.contain("28-0517023ae9ff");
    expect(addresses).to.contain("28-0517023ae9ae");
    expect(addresses).to.contain("28-0517023ae900");
  });

  it("Should return a temperature", async () => {
    let currentTemp = await SensorService.GetTemperature("28-0517023ae9ff");
    expect(currentTemp).to.equal(20.5);
  });
});
