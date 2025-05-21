const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models/db"); // ✅ MySQL Database Connection
const candidateRoutes = require("./routes/candidateRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Add user authentication routes

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Check Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected successfully.");
    connection.release();
  }
});

// ✅ API Routes
app.use("/api/users", userRoutes); // ✅ User authentication routes
app.use("/api/candidates", candidateRoutes);
app.use("/api/requirements", requirementRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
