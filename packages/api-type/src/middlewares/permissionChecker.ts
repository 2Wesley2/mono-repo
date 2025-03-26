import type { Request, Response, NextFunction } from "express";
import errors from "#http-errors";
import { toObjectId } from "#mongoose-wrapper";
import type { ServiceOwner, ServiceEmployee } from "#contract-account";

type Service = ServiceOwner | ServiceEmployee;

export class PermissionChecker {
  constructor(private service: Service) {}

  async verify(req: Request, permission: string): Promise<string> {
    const token = req.cookies.owner;
    if (!token) {
      throw errors.Forbidden([], "Token não fornecido");
    }

    const decodedToken = this.service.isAuth(token);
    const userId = decodedToken.sub;
    const allowed = await this.service.can(permission, userId);

    if (!allowed) {
      throw errors.Forbidden([], "Acesso negado");
    }

    return userId;
  }

  middleware(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = await this.verify(req, permission);
        req.body.owner_id = toObjectId(userId);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
