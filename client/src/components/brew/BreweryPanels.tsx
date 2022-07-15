import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../../server/lib/events";
import { BrewController } from "../../../../server/lib/models/controllerModels";
import { BrewPanel } from "./BrewPanel";

interface BreweryPanelProps {
  brewControllers: BrewController[];
}

export function BreweryPanels(props: BreweryPanelProps) {
  const { brewControllers } = props;

  return (
    <div>
      {brewControllers.map((controller) => {
        return <BrewPanel key={controller.id} controller={controller} />;
      })}
    </div>
  );
}
