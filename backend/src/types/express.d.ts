import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        phone_number?: string | null;
        role: string;
      };
    }
  }
}
