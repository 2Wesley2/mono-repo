import type { Request, Response, NextFunction } from "express";
import Controller from "../../../../components/Controller/controller";
import type { COwner, SOwner, signInParams } from "../contract/index";

export default class OwnerController extends Controller {
  constructor(protected model: COwner) {
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
      const result = await this.model.signUp(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
