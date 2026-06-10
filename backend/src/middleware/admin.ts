import type { Request, Response, NextFunction } from "express";
import { _res } from "../utils/helper";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return _res.error(403, res, "Admin access required");
  }
  next();
};
