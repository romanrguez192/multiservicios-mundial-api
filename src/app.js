const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Settings
app.set("port", process.env.PORT || 4000);

// Routes

module.exports = app;
