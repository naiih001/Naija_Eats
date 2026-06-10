import type { Request, Response, NextFunction } from "express";
import { _res } from "../utils/helper";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  userId: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return _res.error(401, res, "Missing or invalid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return _res.error(401, res, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        phone_number: true,
        role: true,
      }
    });

    if (!user) {
      return _res.error(401, res, "User not found");
    }

    // @ts-ignore - Assuming user is typed elsewhere or handled via declaration merging
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return _res.error(401, res, "Authentication failed");
  }
};
