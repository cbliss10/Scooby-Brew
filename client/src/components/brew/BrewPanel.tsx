import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../context/websocketContext";
import {
  AdjustmentData,
  BrewtrollerState,
  ControllerTemperature,
} from "../../models/brewtrollerModels";
import { PowerLevelComponent } from "./HeatControl";
import { TemperatureDisplay } from "./TempDisplay";

interface Props {
  controller: BrewtrollerState;
}

export function BrewPanel(props: Props) {
  const { controller } = props;
  const units = "F";
  const { socket, status } = useContext(WebSocketContext);
  const [powerLevel, setPowerLevel] = useState<number>(0);
  const [temp, setTemp] = useState<ControllerTemperature>("--");
  const [brewtrollerState, setBrewtrollerState] = useState<"On" | "Off" | "PID" | "Trip">("Off");

  useEffect(() => {
    //subscribeToSocket();
    return function cleanup() {
      if (socket !== undefined) {
        socket.removeAllListeners("brew:update");
      }
    };
  }, []);

  useEffect(() => {
    subscribeToSocket();
  }, [socket]);

  const subscribeToSocket = () => {
    if (socket !== undefined && status === "Connected") {
      // socket.on("brew:update", (updatedStates) => {
      //   console.log("brew:update");
      //   try {
      //     updatedStates.forEach((brewtrollerState) => {
      //       if (controller.id === brewtrollerState.id) {
      //         setTemp(brewtrollerState.temperature);
      //         setPowerLevel(brewtrollerState.powerLevel);
      //         setBrewtrollerState(brewtrollerState.state);
      //         return;
      //       }
      //     });
      //   } catch (err) {
      //     console.log(err);
      //   }
      // });
    }
  };

  const adjustPowerLevel = (adjustment: number) => {
    const adjustmentDto: AdjustmentData = {
      ...controller,
      powerLevel,
    };
    adjustmentDto.powerLevel += adjustment;
    if (adjustmentDto.powerLevel > 100) adjustmentDto.powerLevel = 100;
    else if (adjustmentDto.powerLevel < 0) adjustmentDto.powerLevel = 0;
    if (socket !== undefined) {
      socket.emit("brew:adjust", adjustmentDto, (res) => {
        if (res !== undefined) {
          if ("error" in res) {
            console.log(res.error);
            return;
          }
          const newPower = res.data;
          console.log(`Power level set to ${newPower.powerLevel}`);
          setPowerLevel(res.data.powerLevel);
        }
      });
    }
  };

  const onBrewtrollerStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const targetState = event.target.value;
    if (
      targetState !== "On" &&
      targetState !== "Off" &&
      targetState !== "PID" &&
      targetState !== "Trip"
    )
      return;
    if (socket !== undefined) {
      // optimistic concurrency
      //debugger;
      setBrewtrollerState(targetState);
      const temp: AdjustmentData = { ...controller, state: targetState };
      socket.emit("brew:adjust", temp, (res) => console.log(res));
    }
  };

  return (
    <div className="d-inline-flex flex-column p-2 border ">
      <h1>{controller.name}</h1>
      <TemperatureDisplay temperature={temp} units={units} />
      <PowerLevelComponent powerLevel={powerLevel} adjustPowerLevel={adjustPowerLevel} />
      <div>
        <input
          type="radio"
          value="PID"
          checked={brewtrollerState === "PID"}
          onChange={onBrewtrollerStateChange}
          name={controller.name}
        />
        PID
        <input
          type="radio"
          value="Trip"
          checked={brewtrollerState === "Trip"}
          onChange={onBrewtrollerStateChange}
          name={controller.name}
        />
        Trip
        <input
          type="radio"
          value="On"
          checked={brewtrollerState === "On"}
          onChange={onBrewtrollerStateChange}
          name={controller.name}
        />
        On
        <input
          type="radio"
          value="Off"
          checked={brewtrollerState === "Off"}
          onChange={onBrewtrollerStateChange}
          name={controller.name}
        />
        Off
      </div>
    </div>
  );
}
