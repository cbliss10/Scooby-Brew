import { BreweryPanels } from "./BreweryPanels";
import { useContext, useEffect, useState } from "react";
import Spinner from "../common/Spinner";
import { BrewController } from "../../../../server/lib/models/controllerModels";
import { WebSocketContext } from "../../context/websocketContext";

export const BrewPage = () => {
  const [brewControllers, setBrewControllers] = useState<
    BrewController[] | undefined
  >(undefined);
  const { socket, status } = useContext(WebSocketContext);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    getControllers();
    return function cleanup() {};
  }, [status]);

  function getControllers() {
    if (socket !== undefined && status === "Connected") {
      setIsLoaded(false);
      socket.emit("brew:start", "Start Brew", (res) => {
        console.log("got response");
        if (res !== undefined) {
          if ("error" in res) {
            console.log(res.error);
          } else {
            setBrewControllers(res.data);
            setIsLoaded(true);
          }
        } else console.log("res is undefined");
      });
    }
  }

  return (
    <>
      <h1 className="text-center">Brew!</h1>
      {/* <BrewerySwitchBar breweryStatus={brewerySettings.status} /> */}
      <div className="d-flex justify-content-center">
        {isLoaded && brewControllers !== undefined ? (
          <BreweryPanels brewControllers={brewControllers} />
        ) : (
          <div>
            <Spinner />
            <h2>Loading ...</h2>
          </div>
        )}
      </div>
    </>
  );
};
