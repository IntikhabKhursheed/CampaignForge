import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
// @ts-ignore - memorystore has no types
import MemoryStore from "memorystore";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration to allow frontend dev server to call the API with credentials
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",").map(s => s.trim());
const corsOptions: cors.CorsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true); // same-origin or server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Sessions (must come before routes)
const SessionStore = MemoryStore(session);
const sessionSecret = process.env.SESSION_SECRET || "dev-secret";
app.use(
  session({
    store: new SessionStore({ checkPeriod: 86400000 }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true behind HTTPS/proxy
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // Some environments block binding to fixed ports/hosts. Prefer ephemeral port on localhost.
  const desiredPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
  const host = process.env.HOST || "localhost";

  server.on("error", (err: any) => {
    // Fallback once to an ephemeral port if the requested one is not supported
    if (desiredPort !== 0) {
      log(`listen error on ${host}:${desiredPort} -> ${err?.code || err?.message}. Retrying on an ephemeral port...`);
      server.listen({ port: 0, host }, () => {
        const address = server.address();
        const actualPort = typeof address === 'object' && address ? address.port : desiredPort;
        log(`serving on port ${actualPort}`);
      });
    } else {
      throw err;
    }
  });

  server.listen({
    port: desiredPort,
    host,
  }, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : desiredPort;
    log(`serving on port ${actualPort}`);
  });
})();
