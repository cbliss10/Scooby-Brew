import { Button } from "react-bootstrap";
import { BrewController } from "../../../../server/lib/models/controllerModels";
import { ControllerField } from "./ControllerField";

interface Props {
  controller: BrewController;
  deleteController: (controller: BrewController) => void;
  editController: (controller: BrewController) => void;
}

export function ControllerCard({
  controller,
  deleteController,
  editController,
}: Props) {
  return (
    <div className="card">
      <div className="card-body">
        <ControllerField fieldName="Name" fieldValue={controller.name} />
        <ControllerField
          fieldName="Description"
          fieldValue={controller.description}
        />
        <ControllerField
          fieldName="Heater Pin"
          fieldValue={controller.heaterPin.toString()}
        />
        <ControllerField
          fieldName="Sensor Address"
          fieldValue={controller.sensorAddress}
        />
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-danger"
            onClick={() => deleteController(controller)}
          >
            Delete
          </button>
          <Button variant="primary" onClick={() => editController(controller)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
