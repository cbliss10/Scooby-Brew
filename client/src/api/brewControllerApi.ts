import { handleError, handleResponse } from "./apiUtils";

export function getBrewControllers() {
  return fetch("http://localhost:3001/brewControllers")
    .then(handleResponse)
    .catch(handleError);
}
