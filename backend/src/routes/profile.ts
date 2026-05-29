import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return _res.error(404, res, "User not found");
    }

    _res.success(200, res, "User profile fetched successfully", {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      profile: user.profile,
    });
  } catch (error) {
    _res.error(500, res, "Failed to fetch user profile");
  }
});

router.patch("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { full_name, avatar_url, phone_number } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone_number: phone_number ?? undefined,
        profile: {
          update: {
            full_name: full_name ?? undefined,
            avatar_url: avatar_url ?? undefined,
          },
        },
      },
      include: { profile: true },
    });

    _res.success(200, res, "User profile updated successfully", {
      id: updatedUser.id,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      profile: updatedUser.profile,
    });
  } catch (error) {
    _res.error(500, res, "Failed to update user profile");
  }
});

export default router;
