const Router = require("express-promise-router");
const Empleado = require("../models/Empleado");

const router = new Router();

router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  const empleado = await Empleado.login(usuario, contrasena);

  if (!empleado) {
    throw { type: "not-found", message: "Usuario o contraseña inválidos" };
  }

  res.json(empleado);
});

router.post("/signup", async (req, res) => {
  const empleado = await Empleado.create(req.body);
  res.status(201).json(empleado);
});

module.exports = router;
