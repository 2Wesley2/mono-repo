import type { Request, Response, NextFunction } from "express";
import Controller from "../../../../components/Controller/controller";
import type {
  ServiceOwner,
  SOwner,
  SEmployee,
  signInParams,
} from "../contract/index";

export default class OwnerController extends Controller {
  constructor(protected service: ServiceOwner) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
    this.router.post("/sign-up", this.signUp.bind(this));
    this.router.post("/create-employee", this.createEmployee.bind(this));
  }

  private async signIn(
    req: Request<signInParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const token = await this.service.signIn(data);
      res.cookie("facilite", token, {
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
    req: Request<SOwner>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const result = await this.service.signUp(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  private async createEmployee(
    req: Request<SEmployee>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const result = await this.service.createEmployee(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
