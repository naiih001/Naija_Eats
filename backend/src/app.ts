import express, { Application, Request, Response, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mealsRoutes from "./routes/meals";
import { router as authRoutes } from "./routes/auth";
import onboardingRoutes from "./routes/onboarding";
import profileRoutes from "./routes/profile";
import timetableRoutes from "./routes/timetable";
import { authMiddleware } from "./middleware/auth";

const app: Application = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/auth", authRoutes);
app.use("/meals", authMiddleware, mealsRoutes);
app.use("/timetable", authMiddleware, timetableRoutes);
app.use("/api", authMiddleware, onboardingRoutes);
app.use("/profile", authMiddleware, profileRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
