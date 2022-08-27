import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../../../server/lib/events";
import {
  BrewtrollerState,
  BrewtrollerStateDto,
} from "../../../../server/lib/models/brewtrollerModels";
import { useAppDispatch } from "../../hooks";
import { update } from "../../slices/brewerySlice";
import { SocketContext } from "./BrewPage";
import { TemperatureDisplay } from "./TempDisplay";

interface Props {
  controller: BrewtrollerStateDto;
}

export function BrewPanel(props: Props) {
  const { controller } = props;
  const units = "F";
  const dispatch = useAppDispatch();

  const UpdateBrewtrollerState = (
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined,
    updatedState: BrewtrollerStateDto
  ) => {
    if (socket === undefined) return;
    socket.emit("brew:update", updatedState, (response) => {
      if (response === undefined) return;
      dispatch(update(response));
    });
  };

  return (
    <SocketContext.Consumer>
      {(socket) => (
        <div className="d-inline-flex flex-column p-2 border ">
          <h1>{controller.name}</h1>
          <TemperatureDisplay temperature={controller.temperature} units={units} />
          {/* <PowerLevelComponent powerLevel={powerLevel} adjustPowerLevel={adjustPowerLevel} /> */}
          <div>
            <input
              type="radio"
              value="PID"
              checked={controller.mode === "PID"}
              //onChange={onBrewtrollerStateChange}
              name={controller.name}
            />
            PID
            <input
              type="radio"
              value="Trip"
              checked={controller.mode === "Trip"}
              name={controller.name}
            />
            Trip
            <input
              type="radio"
              value="On"
              checked={controller.mode === "On"}
              onClick={() => UpdateBrewtrollerState(socket, { ...controller, mode: "On" })}
              name={controller.name}
            />
            On
            <input
              type="radio"
              value="Off"
              checked={controller.mode === "Off"}
              name={controller.name}
            />
            Off
          </div>
        </div>
      )}
    </SocketContext.Consumer>
  );
}
