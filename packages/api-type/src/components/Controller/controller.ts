import { Router } from "express";
import { IController } from "./type-controller";

export default class Controller implements IController {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    return this.router;
  }
}
