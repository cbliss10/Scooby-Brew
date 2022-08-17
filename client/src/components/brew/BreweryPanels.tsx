import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../../../server/lib/events";
import { BrewtrollerState } from "../../models/brewtrollerModels";
import { BrewPanel } from "./BrewPanel";

interface BreweryPanelProps {
  brewControllers: BrewtrollerState[];
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
