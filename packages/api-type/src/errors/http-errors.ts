import { GenericError } from "./generic-error";

export class BadRequest extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Invalid request data",
  ) {
    super(400, details, message);
  }
}

export class Unauthorized extends GenericError {
  constructor(
    details: Array<object> = [],
    message: string = "Unauthorized access",
  ) {
    super(401, details, message);
  }
}

export class PaymentRequired extends GenericError {
  constructor(details: Array<object>, message: string = "Payment required") {
    super(402, details, message);
  }
}

export class Forbidden extends GenericError {
  constructor(details: Array<object>, message: string = "Forbidden access") {
    super(403, details, message);
  }
}

export class NotFound extends GenericError {
  constructor(details: Array<object>, message: string = "Resource not found") {
    super(404, details, message);
  }
}

export class MethodNotAllowed extends GenericError {
  constructor(details: Array<object>, message: string = "Method not allowed") {
    super(405, details, message);
  }
}

export class NotAcceptable extends GenericError {
  constructor(details: Array<object>, message: string = "Not acceptable") {
    super(406, details, message);
  }
}

export class ProxyAuthenticationRequired extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Proxy authentication required",
  ) {
    super(407, details, message);
  }
}

export class RequestTimeout extends GenericError {
  constructor(details: Array<object>, message: string = "Request timeout") {
    super(408, details, message);
  }
}

export class Conflict extends GenericError {
  constructor(details: Array<object>, message: string = "Conflict detected") {
    super(409, details, message);
  }
}

export class Gone extends GenericError {
  constructor(details: Array<object>, message: string = "Gone") {
    super(410, details, message);
  }
}

export class LengthRequired extends GenericError {
  constructor(details: Array<object>, message: string = "Length required") {
    super(411, details, message);
  }
}

export class PreconditionFailed extends GenericError {
  constructor(details: Array<object>, message: string = "Precondition failed") {
    super(412, details, message);
  }
}

export class PayloadTooLarge extends GenericError {
  constructor(details: Array<object>, message: string = "Payload too large") {
    super(413, details, message);
  }
}

export class URITooLong extends GenericError {
  constructor(details: Array<object>, message: string = "URI too long") {
    super(414, details, message);
  }
}

export class UnsupportedMediaType extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Unsupported media type",
  ) {
    super(415, details, message);
  }
}

export class RangeNotSatisfiable extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Range not satisfiable",
  ) {
    super(416, details, message);
  }
}

export class ExpectationFailed extends GenericError {
  constructor(details: Array<object>, message: string = "Expectation failed") {
    super(417, details, message);
  }
}

export class ImATeapot extends GenericError {
  constructor(details: Array<object>, message: string = "I'm a teapot") {
    super(418, details, message);
  }
}

export class MisdirectedRequest extends GenericError {
  constructor(details: Array<object>, message: string = "Misdirected request") {
    super(421, details, message);
  }
}

export class UnprocessableEntity extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Unprocessable entity",
  ) {
    super(422, details, message);
  }
}

export class Locked extends GenericError {
  constructor(details: Array<object>, message: string = "Locked") {
    super(423, details, message);
  }
}

export class FailedDependency extends GenericError {
  constructor(details: Array<object>, message: string = "Failed dependency") {
    super(424, details, message);
  }
}

export class UpgradeRequired extends GenericError {
  constructor(details: Array<object>, message: string = "Upgrade required") {
    super(426, details, message);
  }
}

export class PreconditionRequired extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Precondition required",
  ) {
    super(428, details, message);
  }
}

export class TooManyRequests extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Too many requests, please try again later",
  ) {
    super(429, details, message);
  }
}

export class RequestHeaderFieldsTooLarge extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Request header fields too large",
  ) {
    super(431, details, message);
  }
}

export class ConnectionClosedWithoutResponse extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Connection closed without response",
  ) {
    super(444, details, message);
  }
}

export class UnavailableForLegalReasons extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Unavailable for legal reasons",
  ) {
    super(451, details, message);
  }
}

export class ClientClosedRequest extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Client closed request",
  ) {
    super(499, details, message);
  }
}

export class NoContent extends GenericError {
  constructor(message: string = "No content available") {
    super(204, [], message);
  }
}

export class NotImplemented extends GenericError {
  constructor(details: Array<object>, message: string = "Not implemented") {
    super(501, details, message);
  }
}

export class BadGateway extends GenericError {
  constructor(details: Array<object>, message: string = "Bad gateway") {
    super(502, details, message);
  }
}

export class ServiceUnavailable extends GenericError {
  constructor(details: Array<object>, message: string = "Service unavailable") {
    super(503, details, message);
  }
}

export class GatewayTimeout extends GenericError {
  constructor(details: Array<object>, message: string = "Gateway timeout") {
    super(504, details, message);
  }
}

export class HTTPVersionNotSupported extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "HTTP version not supported",
  ) {
    super(505, details, message);
  }
}

export class VariantAlsoNegotiates extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Variant also negotiates",
  ) {
    super(506, details, message);
  }
}

export class InsufficientStorage extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Insufficient storage",
  ) {
    super(507, details, message);
  }
}

export class LoopDetected extends GenericError {
  constructor(details: Array<object>, message: string = "Loop detected") {
    super(508, details, message);
  }
}

export class NotExtended extends GenericError {
  constructor(details: Array<object>, message: string = "Not extended") {
    super(510, details, message);
  }
}

export class NetworkAuthenticationRequired extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Network authentication required",
  ) {
    super(511, details, message);
  }
}

export class NetworkConnectionTimeoutError extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Network connection timeout error",
  ) {
    super(599, details, message);
  }
}

export class InternalServerError extends GenericError {
  constructor(
    details: Array<object>,
    message: string = "Internal server error",
  ) {
    super(500, details, message);
  }
}

const errors = {
  BadRequest: (...args: ConstructorParameters<typeof BadRequest>) =>
    new BadRequest(...args),
  Unauthorized: (...args: ConstructorParameters<typeof Unauthorized>) =>
    new Unauthorized(...args),
  PaymentRequired: (...args: ConstructorParameters<typeof PaymentRequired>) =>
    new PaymentRequired(...args),
  Forbidden: (...args: ConstructorParameters<typeof Forbidden>) =>
    new Forbidden(...args),
  NotFound: (...args: ConstructorParameters<typeof NotFound>) =>
    new NotFound(...args),
  MethodNotAllowed: (...args: ConstructorParameters<typeof MethodNotAllowed>) =>
    new MethodNotAllowed(...args),
  NotAcceptable: (...args: ConstructorParameters<typeof NotAcceptable>) =>
    new NotAcceptable(...args),
  ProxyAuthenticationRequired: (
    ...args: ConstructorParameters<typeof ProxyAuthenticationRequired>
  ) => new ProxyAuthenticationRequired(...args),
  RequestTimeout: (...args: ConstructorParameters<typeof RequestTimeout>) =>
    new RequestTimeout(...args),
  Conflict: (...args: ConstructorParameters<typeof Conflict>) =>
    new Conflict(...args),
  Gone: (...args: ConstructorParameters<typeof Gone>) => new Gone(...args),
  LengthRequired: (...args: ConstructorParameters<typeof LengthRequired>) =>
    new LengthRequired(...args),
  PreconditionFailed: (
    ...args: ConstructorParameters<typeof PreconditionFailed>
  ) => new PreconditionFailed(...args),
  PayloadTooLarge: (...args: ConstructorParameters<typeof PayloadTooLarge>) =>
    new PayloadTooLarge(...args),
  URITooLong: (...args: ConstructorParameters<typeof URITooLong>) =>
    new URITooLong(...args),
  UnsupportedMediaType: (
    ...args: ConstructorParameters<typeof UnsupportedMediaType>
  ) => new UnsupportedMediaType(...args),
  RangeNotSatisfiable: (
    ...args: ConstructorParameters<typeof RangeNotSatisfiable>
  ) => new RangeNotSatisfiable(...args),
  ExpectationFailed: (
    ...args: ConstructorParameters<typeof ExpectationFailed>
  ) => new ExpectationFailed(...args),
  ImATeapot: (...args: ConstructorParameters<typeof ImATeapot>) =>
    new ImATeapot(...args),
  MisdirectedRequest: (
    ...args: ConstructorParameters<typeof MisdirectedRequest>
  ) => new MisdirectedRequest(...args),
  UnprocessableEntity: (
    ...args: ConstructorParameters<typeof UnprocessableEntity>
  ) => new UnprocessableEntity(...args),
  Locked: (...args: ConstructorParameters<typeof Locked>) =>
    new Locked(...args),
  FailedDependency: (...args: ConstructorParameters<typeof FailedDependency>) =>
    new FailedDependency(...args),
  UpgradeRequired: (...args: ConstructorParameters<typeof UpgradeRequired>) =>
    new UpgradeRequired(...args),
  PreconditionRequired: (
    ...args: ConstructorParameters<typeof PreconditionRequired>
  ) => new PreconditionRequired(...args),
  TooManyRequests: (...args: ConstructorParameters<typeof TooManyRequests>) =>
    new TooManyRequests(...args),
  RequestHeaderFieldsTooLarge: (
    ...args: ConstructorParameters<typeof RequestHeaderFieldsTooLarge>
  ) => new RequestHeaderFieldsTooLarge(...args),
  ConnectionClosedWithoutResponse: (
    ...args: ConstructorParameters<typeof ConnectionClosedWithoutResponse>
  ) => new ConnectionClosedWithoutResponse(...args),
  UnavailableForLegalReasons: (
    ...args: ConstructorParameters<typeof UnavailableForLegalReasons>
  ) => new UnavailableForLegalReasons(...args),
  ClientClosedRequest: (
    ...args: ConstructorParameters<typeof ClientClosedRequest>
  ) => new ClientClosedRequest(...args),
  NoContent: (...args: ConstructorParameters<typeof NoContent>) =>
    new NoContent(...args),
  NotImplemented: (...args: ConstructorParameters<typeof NotImplemented>) =>
    new NotImplemented(...args),
  BadGateway: (...args: ConstructorParameters<typeof BadGateway>) =>
    new BadGateway(...args),
  ServiceUnavailable: (
    ...args: ConstructorParameters<typeof ServiceUnavailable>
  ) => new ServiceUnavailable(...args),
  GatewayTimeout: (...args: ConstructorParameters<typeof GatewayTimeout>) =>
    new GatewayTimeout(...args),
  HTTPVersionNotSupported: (
    ...args: ConstructorParameters<typeof HTTPVersionNotSupported>
  ) => new HTTPVersionNotSupported(...args),
  VariantAlsoNegotiates: (
    ...args: ConstructorParameters<typeof VariantAlsoNegotiates>
  ) => new VariantAlsoNegotiates(...args),
  InsufficientStorage: (
    ...args: ConstructorParameters<typeof InsufficientStorage>
  ) => new InsufficientStorage(...args),
  LoopDetected: (...args: ConstructorParameters<typeof LoopDetected>) =>
    new LoopDetected(...args),
  NotExtended: (...args: ConstructorParameters<typeof NotExtended>) =>
    new NotExtended(...args),
  NetworkAuthenticationRequired: (
    ...args: ConstructorParameters<typeof NetworkAuthenticationRequired>
  ) => new NetworkAuthenticationRequired(...args),
  NetworkConnectionTimeoutError: (
    ...args: ConstructorParameters<typeof NetworkConnectionTimeoutError>
  ) => new NetworkConnectionTimeoutError(...args),
  InternalServerError: (
    ...args: ConstructorParameters<typeof InternalServerError>
  ) => new InternalServerError(...args),
};
export default errors;
