import Controller from "../../../../components/Controller/controller";
import type { Request, Response, NextFunction } from "express";
import type { TUser, IUser } from "./UserModel";
import { signInParams } from "./UserModel";

export default class UserController extends Controller {
  constructor(private model: TUser) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-in", this.signIn.bind(this));
    this.router.post("/sign-up", this.signUp.bind(this));
  }

  private async signIn(
    req: Request<signInParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const token = await this.model.signIn(data);
      res.cookie("facilite", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
    } catch (error) {
      next(error);
    }
  }

  private async signUp(
    req: Request<IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const result = await this.model.signUp(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
