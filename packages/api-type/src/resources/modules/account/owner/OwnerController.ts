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
      console.error("Erro ao criar Owner:", error);
      next(error);
    }
  }

  private async createEmployee(
    req: Request<EmployeeBodyRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log(
        "Iniciando criação de funcionário. Dados recebidos:",
        req.body,
      );
      console.log("Tipo dos dados recebidos:", typeof req.body);
      const data = req.body;
      const result = await this.service.createEmployee(data);
      console.log("Funcionário criado com sucesso. Resultado:", result);
      console.log("Tipo do resultado:", typeof result);
      res.status(201).json(result);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
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
          console.error("Token não fornecido");
          throw errors.Forbidden([], "Token não fornecido");
        }

        const decodedToken = this.service.isAuth(token);
        const userId = decodedToken.id;
        const allowed = await RbacHandler.can(permission, userId);
        if (!allowed) {
          console.error("Acesso negado para usuário:", userId);
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
