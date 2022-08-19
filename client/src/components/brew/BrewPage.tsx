import { BreweryPanels } from "./BreweryPanels";
import { useEffect, useState } from "react";
import Spinner from "../common/Spinner";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectBrewery, update } from "../../slices/brewerySlice";
import { ClientToServerEvents, ServerToClientEvents } from "../../../../server/lib/events";
import { default as io, Socket } from "socket.io-client";

export const BrewPage = () => {
  const breweryState = useAppSelector(selectBrewery);
  const [socket, setSocket] = useState<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getControllers();
  }, []);

  function getControllers() {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
      io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("brew:initialState", (res) => {
      console.log(res);
      dispatch(update(res));
      setIsLoaded(true);
    });

    newSocket.on("brew:update", (state) => {
      console.log("here");
      dispatch(update(state));
    });

    // Add 'socket.on's here
  }

  const toggleBrewery = (breweryState: "ON" | "OFF") => {
    if (breweryState === "ON") {
      socket?.emit("brew:start", null, (response) => {
        if (response != undefined) dispatch(update(response));
      });
    } else {
      socket?.emit("brew:stop", null, (response) => {
        if (response != undefined) dispatch(update(response));
      });
    }
  };

  return (
    <>
      <h1 className="text-center">Brew!</h1>
      {/* <BrewerySwitchBar breweryStatus={brewerySettings.status} /> */}
      <div className="d-flex justify-content-center">
        {isLoaded && breweryState !== undefined ? (
          <div>
            <h1>State:{breweryState.state}</h1>
            <BreweryPanels brewControllers={breweryState.brewtrollerStates} />
            <button onClick={() => toggleBrewery("ON")}>On</button>
            <button onClick={() => toggleBrewery("OFF")}>Off</button>
          </div>
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
