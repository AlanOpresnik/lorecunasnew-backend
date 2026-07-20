require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();

connectDB();

app.use(cookieParser());

// 👇 esto es lo que faltaba
const allowedOrigins = [
  "http://localhost:3000",
  "https://lorecunas-new.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // deniega sin tirar Error
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // responde el preflight explícitamente

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lorecunas API" });
});

const productRoutes = require("./routes/productRoutes");
const statsRoutes = require("./routes/statsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const mercadoPagoRoutes = require("./routes/mercadoPagoRoutes");
const auth = require('./routes/auth')

app.use("/api/products", productRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);
app.use("/api/auth", auth)

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});