import { useEffect } from "react";
import { Brewtroller } from "../../../../server/lib/models/brewtrollerModels";
import { ControllerCard } from "./ControllerCard";

interface Props {
  controllers: Brewtroller[];
  deleteController: (controller: Brewtroller) => void;
  editController: (controller: Brewtroller) => void;
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
