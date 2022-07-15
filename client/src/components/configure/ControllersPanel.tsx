import { useEffect } from "react";
import { BrewController } from "../../../../server/lib/models/controllerModels";
import { ControllerCard } from "./ControllerCard";

interface Props {
  controllers: BrewController[];
  deleteController: (controller: BrewController) => void;
  editController: (controller: BrewController) => void;
}

export function ControllerPanel({
  controllers,
  deleteController,
  editController,
}: Props) {
  useEffect(() => {
    console.log(controllers.length);
  });

  const controllerCards = controllers.map((controller) => {
    return (
      <ControllerCard
        key={controller.id}
        controller={controller}
        deleteController={deleteController}
        editController={editController}
      />
    );
  });
  return <div className="card-group">{controllerCards}</div>;
}
