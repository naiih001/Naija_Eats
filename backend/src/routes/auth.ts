import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email";

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

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return _res.error(400, res, "Token is required");
    }

    const user = await prisma.user.findUnique({
      where: { verifyToken: token }
    });

    if (!user || !user.verifyTokenExp || user.verifyTokenExp < new Date()) {
      return _res.error(400, res, "Invalid or expired verification token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExp: null
      }
    });

    return _res.success(200, res, "Email verified successfully. You can now log in.");
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Server error during verification");
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

export default router;
