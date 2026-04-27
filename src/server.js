import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/borrows", borrowRoutes);

// Root redirect to docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api-docs`);
});
