import type { Request, Response, NextFunction } from "express";
import Controller from "../../../../components/Controller/controller";
import type { ServiceEmployee, signInParams } from "../contract/index";

export default class EmployeeController extends Controller {
  constructor(protected service: ServiceEmployee) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
  }

  private async signIn(
    req: Request<signInParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("Iniciando login de funcionário. Dados recebidos:", req.body);
      console.log("Tipo dos dados recebidos:", typeof req.body);
      const data = req.body;
      const token = await this.service.signIn(data);
      console.log("Token gerado com sucesso. Tipo do token:", typeof token);
      res.cookie("employee", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
      res.status(200).json("logged in");
    } catch (error) {
      console.error("Erro ao realizar login de funcionário:", error);
      next(error);
    }
  }
}
