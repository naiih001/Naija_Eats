import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone_number, password } = req.body;

    if (!full_name || !email || !phone_number || !password) {
      return _res.error(400, res, "All fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone_number,
        isVerified: false,
        verifyToken,
        verifyTokenExp,
        profile: {
          create: { full_name }
        }
      },
      include: { profile: true }
    });

    await sendVerificationEmail(user.email, verifyToken);

    return _res.success(201, res, "User registered successfully. Please check your email to verify your account.", {
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error(err);
    _res.error(500, res, "Server error during registration");
  }
});

router.get("/verify-email", async (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${frontendUrl}/sign-in?status=error&message=Token%20is%20required&verified=false`);
    }

    const user = await prisma.user.findUnique({
      where: { verifyToken: token as string }
    });

    if (!user || !user.verifyTokenExp || user.verifyTokenExp < new Date()) {
      return res.redirect(`${frontendUrl}/sign-in?status=error&message=Invalid%20or%20expired%20verification%20token&verified=false`);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExp: null
      }
    });

    return res.redirect(`${frontendUrl}/sign-in?status=success&message=Email%20verified%20successfully&verified=true`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${frontendUrl}/sign-in?status=error&message=Server%20error%20during%20verification&verified=false`);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return _res.error(401, res, "Invalid email or password");
    }

    if (!user.isVerified) {
      return _res.error(403, res, "Please verify your email address before logging in");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

    return _res.success(200, res, "User logged in successfully", { token });
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Server error");
  }
});

router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return _res.error(400, res, "Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return _res.error(404, res, "User not found");
    }

    if (user.isVerified) {
      return _res.error(400, res, "Email is already verified");
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifyToken,
        verifyTokenExp
      }
    });

    await sendVerificationEmail(user.email, verifyToken);

    return _res.success(200, res, "Verification email resent successfully.");
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Server error while resending verification email");
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return _res.error(400, res, "Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Return success even if user doesn't exist to prevent email enumeration
    if (!user) {
      return _res.success(200, res, "If an account with that email exists, a password reset link has been sent.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp
      }
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return _res.success(200, res, "If an account with that email exists, a password reset link has been sent.");
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Server error during forgot password request");
  }
});

router.get("/reset-password", async (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${frontendUrl}/forgot-password?status=error&message=Token%20is%20required`);
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token as string }
    });

    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      return res.redirect(`${frontendUrl}/forgot-password?status=error&message=Invalid%20or%20expired%20reset%20token`);
    }

    return res.redirect(`${frontendUrl}/reset-password?token=${token}&status=success&message=Set%20new%20password`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${frontendUrl}/forgot-password?status=error&message=Server%20error%20during%20password%20reset`);
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return _res.error(400, res, "Token and new password are required");
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    });

    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      return _res.error(400, res, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null
      }
    });

    return _res.success(200, res, "Password reset successfully. You can now log in with your new password.");
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Server error during password reset");
  }
});

export default router;
