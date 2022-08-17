import { Action } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../server/lib/events";
import { BreweryState } from "./models/breweryModels";
import { store } from "./store";
import breweryReducer from "./slices/brewerySlice";

type ScoobyBrewStore = {
  brewery: BreweryState;
};

const initialState: ScoobyBrewStore = {
  brewery: {
    state: "OFF",
    name: "Default",
    brewtrollerStates: [],
  },
};

export default function rootReducer(
  state: ScoobyBrewStore = initialState,
  action: Action
): ScoobyBrewStore {
  return {
    brewery: breweryReducer(state.brewery, action),
  };
}
