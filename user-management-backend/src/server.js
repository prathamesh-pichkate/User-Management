require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database.js");
const userRoutes = require("./routes/userRoutes.js");
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URLS.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman / server-side requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Management API is running",
  });
});

// Error handling (last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
