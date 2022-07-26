import { useContext, useEffect, useState } from "react";
import {
  BrewtrollerState,
  ControllerTemperature,
  AdjustmentData,
} from "../../../../server/lib/models/brewtrollerModels";
import { WebSocketContext } from "../../context/websocketContext";
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

  useEffect(() => {
    subscribeToSocket();
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
    console.log("Trying to subscribe to websocket events ... ");
    if (socket !== undefined && status === "Connected") {
      socket.on("brew:update", (updatedStates) => {
        try {
          updatedStates.forEach((controllerDto) => {
            if (controller.id === controllerDto.id) {
              setTemp(controllerDto.temperature);
              setPowerLevel(controllerDto.powerLevel);
              return;
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
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

  return (
    <div className="d-inline-flex flex-column p-2 border ">
      <h1>{controller.name}</h1>
      <TemperatureDisplay temperature={temp} units={units} />
      <PowerLevelComponent
        powerLevel={powerLevel}
        adjustPowerLevel={adjustPowerLevel}
      />
    </div>
  );
}
