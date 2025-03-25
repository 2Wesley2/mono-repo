import type { Request, Response, NextFunction } from "express";
import Controller from "#controller";
import type { ServiceOwner } from "#contract-account";
import { validateOwner } from "#middlewares";
import type {
  SignUpOwnerRequest,
  SignUpEmployeeRequest,
  SignInRequest,
} from "#http";

import { PermissionChecker } from "#permission-checker";
import type { PermissionChecker as TypePermissionChecker } from "#permission-checker";
export default class OwnerController extends Controller {
  private permissionChecker: TypePermissionChecker;
  constructor(protected service: ServiceOwner) {
    super();
    this.permissionChecker = new PermissionChecker(service);
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
    this.router.post("/sign-up", validateOwner, this.signUp.bind(this));
    this.router.post(
      "/create-employee",
      this.permissionChecker.middleware("CREATE_EMPLOYEE").bind(this),
      this.createEmployee.bind(this),
    );
  }

  private async signIn(
    req: SignInRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const token = await this.service.signIn(data);
      res.cookie("owner", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
      res.status(200).json("logged in");
    } catch (error) {
      next(error);
    }
  }

  private async signUp(
    req: SignUpOwnerRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const result = await this.service.signUp(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async createEmployee(
    req: SignUpEmployeeRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const result = await this.service.createEmployee(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
