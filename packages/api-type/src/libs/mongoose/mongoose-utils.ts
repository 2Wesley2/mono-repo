import mongoose from "mongoose";
import type {
  ToObjectId,
  RegisterConnectionEventsFunction,
  ConnectionEvents,
} from "#mongoose-wrapper";

export const toObjectId: ToObjectId = (id: string) =>
  new mongoose.Types.ObjectId(id);

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
