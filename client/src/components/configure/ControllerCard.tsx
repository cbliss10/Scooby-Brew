import { Button } from "react-bootstrap";
import { Brewtroller } from "../../../../server/lib/models/brewtrollerModels";
import { ControllerField } from "./ControllerField";

interface Props {
  controller: Brewtroller;
  deleteController: (controller: Brewtroller) => void;
  editController: (controller: Brewtroller) => void;
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
