import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreweryDto } from "../../../server/lib/models/breweryModels";
import { BreweryState } from "../models/breweryModels";
import { RootState } from "../store";

const initialState: BreweryDto = {
  mode: "Off",
  name: "Default",
  brewtrollerDtos: [],
};

const brewerySlice = createSlice({
  name: "brewery",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<BreweryDto>) => {
      state.mode = action.payload.mode;
      state.brewtrollerDtos = action.payload.brewtrollerDtos;
      state.name = action.payload.name;
    },
  },
});

export const { update } = brewerySlice.actions;

export const selectBrewery = (state: RootState) => state.brewery;

export default brewerySlice.reducer;
