import BcryptWrapper from "./bcrypt/bcrypt-wrapper";
import { JSONWebTokenWrapper } from "#jwt-wrapper";

type InstanceCallableKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type ServicesType = {
  bcrypt: <M extends InstanceCallableKeys<BcryptWrapper>>(
    strArg: string,
    method: M,
    ...args: Parameters<BcryptWrapper[M]>
  ) => ReturnType<BcryptWrapper[M]>;
  jwt: <M extends InstanceCallableKeys<JSONWebTokenWrapper>>(
    method: M,
    ...args: Parameters<JSONWebTokenWrapper[M]>
  ) => ReturnType<JSONWebTokenWrapper[M]>;
};

const bcryptFn = <M extends InstanceCallableKeys<BcryptWrapper>>(
  strArg: string,
  method: M,
  ...args: Parameters<BcryptWrapper[M]>
): ReturnType<BcryptWrapper[M]> => {
  const instance = new BcryptWrapper(strArg);
  const methodFn = instance[method] as unknown as (
    ...args: Parameters<BcryptWrapper[M]>
  ) => ReturnType<BcryptWrapper[M]>;
  return methodFn(...args);
};

const jwtFn = <M extends InstanceCallableKeys<JSONWebTokenWrapper>>(
  method: M,
  ...args: Parameters<JSONWebTokenWrapper[M]>
): ReturnType<JSONWebTokenWrapper[M]> => {
  const instance = new JSONWebTokenWrapper();
  const methodFn = instance[method] as unknown as (
    ...args: Parameters<JSONWebTokenWrapper[M]>
  ) => ReturnType<JSONWebTokenWrapper[M]>;
  return methodFn(...args);
};

const services: ServicesType = {
  bcrypt: (strArg, method, ...args) => bcryptFn(strArg, method, ...args),
  jwt: (method, ...args) => jwtFn(method, ...args),
};

export default services;
