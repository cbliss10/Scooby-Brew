import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreweryState } from "../models/breweryModels";
import { RootState } from "../store";

const initialState: BreweryState = {
  state: "OFF",
  name: "Default",
  brewtrollerStates: [],
};

const brewerySlice = createSlice({
  name: "brewery",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<BreweryState>) => {
      state.state = action.payload.state;
    },
  },
});

export const { update } = brewerySlice.actions;

export const selectBrewery = (state: RootState) => state.brewery;

export default brewerySlice.reducer;
