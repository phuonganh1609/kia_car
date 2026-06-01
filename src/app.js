import express from "express";
import cors from "cors";
import appointmentRoute from "./routes/appointment.route.js";
import carRoute from "./routes/car.route.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger YAML documentation
const swaggerDocument = YAML.load(
  path.join(__dirname, "./swagger/swagger.yaml"),
);
// Load Custom CSS
const customCss = fs.readFileSync(
  path.join(__dirname, "./swagger/swagger-custom.css"),
  "utf8",
);

const app = express();

// Swagger UI - served at /swagger
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: "/api-docs.json",
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customCss: customCss,
  }),
);
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(null, false);
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health Check
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Routes
app.use("/api/appointments", appointmentRoute);
app.use("/api/cars", carRoute);

// Error handling middlewares (must be after all routes)
app.use(notFound);
app.use(errorHandler);


export default app;