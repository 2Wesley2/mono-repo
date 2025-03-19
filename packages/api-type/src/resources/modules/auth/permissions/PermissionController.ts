import type { Request, Response, NextFunction } from "express";
import type { CPermission } from "../contract/index";
import Controller from "#controller";

export default class PermissionController extends Controller {
  constructor(protected model: CPermission) {
    super();
    this.initRouter();
  }

  public initRouter(): void {
    this.router.post(
      "/insert-many-permissions",
      this.setManyPermissions.bind(this),
    );
  }

  public async setManyPermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const permissions = req.body;
      const result = await this.model.setManyPermissions(permissions);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
