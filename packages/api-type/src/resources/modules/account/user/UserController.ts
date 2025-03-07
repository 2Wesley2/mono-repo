import Controller from "../../../../components/Controller/controller";
import type { Request, Response, NextFunction } from "express";
import type { TUser, IUser } from "./UserModel";

export default class UserController extends Controller {
  constructor(private model: TUser) {
    super();
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post("/sign-up", this.signUp.bind(this));
  }

  private async signUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body as IUser;
      const result = await this.model.signUp(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
