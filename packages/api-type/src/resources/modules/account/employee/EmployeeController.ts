import type { Response, NextFunction } from "express";
import Controller from "#controller";
import type { ServiceEmployee } from "#contract-account";
import type { SignInRequest } from "#http";

export default class EmployeeController extends Controller {
  constructor(protected service: ServiceEmployee) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
  }

  private async signIn(
    req: SignInRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const token = await this.service.signIn(data);
      res.cookie("employee", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
      res.status(200).json("logged in");
    } catch (error) {
      next(error);
    }
  }
}
