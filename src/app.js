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

const app = express();

// ==========================================
// 1. CẤU HÌNH CORS (Phải đặt TRÊN CÙNG để áp dụng cho cả Swagger)
// ==========================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (như Postman, Mobile apps, hoặc chính server tải file cấu hình)
    if (!origin) return callback(null, true);

    // Cho phép nếu nằm trong whitelist hoặc nếu là request từ trang Swagger UI nội bộ
    if (allowedOrigins.includes(origin) || origin.includes("onrender.com")) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health Check
app.get("/ping", (req, res) => {
  res.send("pong");
});

// ==========================================
// 2. CẤU HÌNH SWAGGER UI
// ==========================================
try {
  const swaggerDocument = YAML.load(path.join(__dirname, "./swagger/swagger.yaml"));
  const customCss = fs.readFileSync(path.join(__dirname, "./swagger/swagger-custom.css"), "utf8");

  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        displayOperationId: true,
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
      customCss: customCss,
    })
  );
} catch (error) {
  console.error("Không thể load cấu hình Swagger:", error.message);
}

// ==========================================
// 3. ROUTES CỦA ỨNG DỤNG
// ==========================================
app.use("/api/appointments", appointmentRoute);
app.use("/api/cars", carRoute);

// ==========================================
// 4. ERROR MIDDLEWARES (Luôn đặt cuối cùng)
// ==========================================
app.use(notFound);
app.use(errorHandler);

export default app;