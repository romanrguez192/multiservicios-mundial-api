const Router = require("express-promise-router");
const Empleado = require("../models/Empleado");
const Trabajador = require("../models/Trabajador");
const Encargado = require("../models/Encargado");

const router = new Router();

router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  const trabajador = await Trabajador.login(usuario, contrasena);

  if (!trabajador) {
    throw { type: "not-found", message: "Usuario o contraseña inválidos" };
  }

  if (trabajador.tipoTrabajador === "empleado") {
    const empleado = await Empleado.findById(trabajador.cedula);
    return res.json(empleado);
  }

  if (trabajador.tipoTrabajador === "encargado") {
    const encargado = await Encargado.findById(trabajador.cedula);
    return res.json(encargado);
  }

  res.json(trabajador);
});

router.post("/signup", async (req, res) => {
  const empleado = await Empleado.create(req.body);
  res.status(201).json(empleado);
});

module.exports = router;
