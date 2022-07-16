import { ValidationErrorItem } from "joi";

export enum Errors {
  CONTROLLER_NOT_FOUND = "controller not found",
  INVALID_PAYLOAD = "invalid payload",
  UNKNOWN_ERROR = "Unknown error occured",
}

const errorValues: string[] = Object.values(Errors);

export function sanitizeErrorMessage(message: any) {
  if (errorValues.includes(message)) {
    return message;
  } else {
    return "an unknown error has occurred";
  }
}

export function mapErrorDetails(details: ValidationErrorItem[]) {
  return details.map((item) => ({
    message: item.message,
    path: item.path,
    type: item.type,
  }));
}
