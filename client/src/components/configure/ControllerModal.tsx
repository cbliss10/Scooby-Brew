import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Brewtroller } from "../../../../server/lib/models/brewtrollerModels";
import { WebSocketContext } from "../../context/websocketContext";

interface Props {
  controller: Brewtroller | undefined;
  show: boolean;
  isNew: boolean;
  onSubmit: (
    controller: Brewtroller | Omit<Brewtroller, "id">,
    isNew: boolean
  ) => void;
  closeModal: () => void;
}

const initialController: Brewtroller = {
  id: "noid",
  name: "New controller",
  sensorAddress: "NA",
  heaterPin: -1,
  description: "",
};

export function ControllerModal({
  controller,
  show,
  isNew,
  onSubmit,
  closeModal,
}: Props) {
  const { socket, status } = useContext(WebSocketContext);
  const [saveController, setSaveController] =
    useState<Brewtroller>(initialController);
  const [sensorAddresses, setSensorAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (isNew) {
      setSaveController(initialController);
    } else {
      if (controller === undefined) {
        throw Error("Controller is not defined");
      }
      // set sensor address
      const controllerToSet = { ...controller };
      if (!sensorAddresses.includes(controllerToSet.sensorAddress)) {
        controllerToSet.sensorAddress = "";
      }

      setSaveController(controller);
    }
  }, [controller]);

  useEffect(() => {
    getSensors();
  }, [socket, status]);

  function getSensors() {
    if (socket !== undefined && status === "Connected") {
      console.log("trying to get sensors");
      socket.emit("sensor:getAll", "test", (res) => {
        if ("error" in res) {
          console.log(res.error);
        } else {
          console.log("sensor list returned: " + res.data);
          setSensorAddresses(res.data);
        }
      });
    }
  }

  function sensorAddressOptions() {
    console.log(
      "populating sensor addresses, count of " + sensorAddresses.length
    );
    const nonEmptyElements = sensorAddresses.map((address) => (
      <option key={address} value={address}>
        {address}
      </option>
    ));

    return (
      <>
        <option value=""></option>
        {nonEmptyElements}
      </>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isNew ? "Add Controller" : "Edit Controller"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            id="add-edit-controller-form"
            onSubmit={() => onSubmit(saveController, isNew)}
          >
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={saveController.name}
                onChange={(e) =>
                  setSaveController({
                    ...saveController,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                value={saveController.description}
                onChange={(e) =>
                  setSaveController({
                    ...saveController,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sensor Address</label>
              <select
                value={saveController.sensorAddress}
                onChange={(e) =>
                  setSaveController({
                    ...saveController,
                    sensorAddress: e.target.value,
                  })
                }
              >
                {sensorAddressOptions()}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Heater Pin</label>
              <input
                type="text"
                value={saveController.heaterPin}
                onChange={(e) =>
                  setSaveController({
                    ...saveController,
                    heaterPin: -1,
                  })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <button
            type="submit"
            form="add-edit-controller-form"
            className="btn btn-primary"
          >
            Save changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
