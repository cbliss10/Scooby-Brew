import { BrewtrollerStateDto } from "../../../../server/lib/models/brewtrollerModels";
import { BrewPanel } from "./BrewPanel";

interface BreweryPanelProps {
  brewtrollers: BrewtrollerStateDto[];
}

export function BreweryPanels(props: BreweryPanelProps) {
  const { brewtrollers } = props;

  return (
    <div>
      {brewtrollers.map((controller) => {
        return <BrewPanel key={controller.id} controller={controller} />;
      })}
    </div>
  );
}
