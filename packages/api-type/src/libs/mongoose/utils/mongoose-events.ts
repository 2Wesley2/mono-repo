import mongoose from "mongoose";
import type {
  RegisterConnectionEventsFunction,
  ConnectionEvents,
} from "#mongoose-wrapper/common/mongoose-types";

export const registerConnectionEvents: RegisterConnectionEventsFunction = <
  ErrorType = Error,
>(
  events: ConnectionEvents<ErrorType>,
): void => {
  Object.entries(events).forEach(([event, callback]) => {
    mongoose.connection.on(
      event as keyof ConnectionEvents<ErrorType>,
      callback,
    );
  });
};
