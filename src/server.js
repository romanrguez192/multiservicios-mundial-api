require("dotenv").config();
const express = require("express");

// Servidor
const app = express();
app.use(express.json());

// Puerto
const port = process.env.PORT || 3000;

// Rutas

// Inicio del servidor
app.listen(port, () => console.log(`Server listening on port ${port}`));
