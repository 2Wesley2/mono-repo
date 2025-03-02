declare module "controller" {
  import { Router } from "express";

  export interface IController {
    getRouter(): Router;
  }

  export class Controller implements IController {
    protected router: Router;
    constructor();
    getRouter(): Router;
  }
}
export {};
