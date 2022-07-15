// import { stat } from "fs";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BrewController } from "../../../../server/lib/models/controllerModels";
import { WebSocketContext } from "../../context/websocketContext";
// import Spinner from "../common/Spinner";
import Spinner from "../common/Spinner";
import { ControllerModal } from "./ControllerModal";
import { ControllerPanel } from "./ControllersPanel";

const testInitialControllers: BrewController[] = [
  {
    id: "test",
    name: "name",
    description: "This is a test controller",
    sensorAddress: "12345",
    heaterPin: 3,
  },
];

export const ConfigPage = function () {
  const [brewControllers, setBrewControllers] = useState<BrewController[]>(
    testInitialControllers
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [selectedController, setSelectedController] = useState<
    BrewController | undefined
  >(undefined);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { socket, status } = useContext(WebSocketContext);

  useEffect(() => {
    getControllers();
  }, [socket, status]);

  function getControllers() {
    if (socket !== undefined && status === "Connected") {
      socket.emit("controller:list", (res) => {
        if ("error" in res) {
          console.log(res.error);
        } else {
          setBrewControllers(res.data);
          setIsLoaded(true);
        }
      });
    }
  }

  function deleteController(controller: BrewController) {
    if (
      window.confirm(
        `Are you sure you would like to delete controller ${controller.name}`
      )
    ) {
      if (socket !== undefined) {
        socket.emit("controller:delete", controller.id, (res) => {
          console.log(res);
          getControllers();
        });
      }
    }
  }

  function addOrUpdateController(
    controller: BrewController | Omit<BrewController, "id">,
    isNew: boolean
  ) {
    if (socket !== undefined) {
      if (isNew) {
        const addController = controller as Omit<BrewController, "id">;
        socket.emit("controller:add", addController, (res) => {
          console.log(res);
        });
      } else {
        const updateController = controller as BrewController;
        socket.emit("controller:update", updateController, (res) => {
          console.log(res);
        });
      }
      console.log("addOrUpdateController");
    }
  }

  function editController(controller: BrewController) {
    console.log("updateController");
    setSelectedController(controller);
    setIsNew(false);
    setIsModalOpen(true);
  }

  function newController() {
    console.log("newController");
    setSelectedController(undefined);
    setIsNew(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <h1 className="text-center">Brewery Configuration!</h1>
      <div className="d-flex justify-content-center">
        {isLoaded && brewControllers !== undefined ? (
          <ControllerPanel
            controllers={brewControllers}
            deleteController={deleteController}
            editController={editController}
          />
        ) : (
          <div>
            <Spinner />
            <h2>Loading ...</h2>
          </div>
        )}
      </div>
      <Button variant="primary" onClick={newController}>
        Add New Controller
      </Button>
      <ControllerModal
        controller={selectedController}
        show={isModalOpen}
        onSubmit={addOrUpdateController}
        closeModal={closeModal}
        isNew={isNew}
      />
    </div>
  );
};
