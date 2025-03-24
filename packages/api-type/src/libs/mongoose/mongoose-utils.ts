import mongoose, { Schema } from "mongoose";
import type {
  ToObjectId,
  RegisterConnectionEventsFunction,
  ConnectionEvents,
  MiddlewareConfig,
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

interface MiddlewareStrategy<TEvent> {
  apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: TEvent },
  ): void;
}

class PreMiddlewareStrategy
  implements MiddlewareStrategy<"createCollection" | RegExp>
{
  apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: "createCollection" | RegExp },
  ): void {
    schema.pre(middleware.hookEvent, middleware.fn);
  }
}

class PostMiddlewareStrategy
  implements
    MiddlewareStrategy<"createCollection" | "insertMany" | "bulkWrite" | RegExp>
{
  apply(
    schema: Schema,
    middleware: MiddlewareConfig & {
      hookEvent: "createCollection" | "insertMany" | "bulkWrite" | RegExp;
    },
  ): void {
    schema.post(middleware.hookEvent, middleware.fn);
  }
}

export class MiddlewareContext {
  private strategies: Record<string, MiddlewareStrategy<any>>;

  constructor() {
    this.strategies = {
      pre: new PreMiddlewareStrategy(),
      post: new PostMiddlewareStrategy(),
    };
  }

  applyMiddleware(schema: Schema, middleware: MiddlewareConfig): void {
    const strategy = this.strategies[middleware.method];
    if (!strategy) {
      throw new Error(`Método de middleware inválido: ${middleware.method}`);
    }
    strategy.apply(schema, middleware);
  }
}
