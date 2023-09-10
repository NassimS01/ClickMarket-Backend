const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // Importa la biblioteca 'path'

app.use(bodyParser.urlencoded({ extended: true, limit: 50000000 }));
app.use(bodyParser.json({ limit: 50000000 }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia esto a la URL de tu frontend en Vercel
    credentials: true,
  })
);

// Configuración

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Importa las rutas
const stripe = require("./controllers/stripe");
const user = require("./controllers/user");
const product = require("./controllers/product");

app.use("/api/v2/stripe", stripe);
app.use("/api/v2/user", user);
app.use("/api/v2/products", product);

// Ruta para redirigir todas las solicitudes no manejadas a la URL de tu frontend en Vercel
app.get("*", (req, res) => {
  res.redirect("http://localhost:5000" + req.originalUrl);
});

// Middleware para manejar errores
app.use(ErrorHandler);

module.exports = app;
