const express = require("express");
const cors = require("cors");
const mountRoutes = require("./routes");
const errorHandler = require("./errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Settings
app.set("port", process.env.PORT || 4000);

// Routes
mountRoutes(app);

// Error Handling
app.use(errorHandler);

module.exports = app;
