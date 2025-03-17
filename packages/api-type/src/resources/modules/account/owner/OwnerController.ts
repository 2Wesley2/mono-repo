import type { Request, Response, NextFunction } from "express";
import Controller from "../../../../components/Controller/controller";
import type {
  ServiceOwner,
  SEmployee,
  EmployeeBodyRequest,
} from "../contract/index";
import RbacHandler from "../../../../middlewares/rbacHandler";
import errors from "#errors";
import { validateOwner } from "#middlewares";
import type { SignInRequest, SignUpRequest } from "#http-request";

export default class OwnerController extends Controller {
  constructor(protected service: ServiceOwner) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
    this.router.post("/sign-up", validateOwner, this.signUp.bind(this));
    this.router.post(
      "/create-employee",
      this.checkPermission("CREATE_EMPLOYEE").bind(this),
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
    req: SignUpRequest,
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
    req: Request<EmployeeBodyRequest>,
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

  private checkPermission(permission: string) {
    return async (
      req: Request<SEmployee>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = req.cookies.owner;

        if (!token) {
          throw errors.Forbidden([], "Token não fornecido");
        }

        const decodedToken = this.service.isAuth(token);
        const userId = decodedToken.id;
        const allowed = await RbacHandler.can(permission, userId);

        if (!allowed) {
          throw errors.Forbidden([], "Acesso negado");
        } else {
          req.body.owner_id = userId;
          next();
        }
      } catch (error) {
        next(error);
      }
    };
  }
}
