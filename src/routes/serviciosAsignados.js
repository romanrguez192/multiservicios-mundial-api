const Router = require("express-promise-router");
const ServicioAsignado = require("../models/ServicioAsignado");

const router = new Router();

// Obtener todos de una sucursal
router.get("/:id", async (req, res) => {
  const cedEmpleado = parseInt(req.params.id);
  const serviciosAsignados = await ServicioAsignado.findAll(cedEmpleado);
  res.json(serviciosAsignados);
});

// Crear uno
router.post("/:id", async (req, res) => {
  const cedEmpleado = parseInt(req.params.id);
  const codServicio = parseInt(req.body.codServicio);
  const servicioAsignado = await ServicioAsignado.create(
    cedEmpleado,
    codServicio
  );
  res.status(201).json(servicioAsignado);
});

// Borrar
router.delete("/:cedEmpleado/:codServicio", async (req, res) => {
  const cedEmpleado = parseInt(req.params.cedEmpleado);
  const codServicio = parseInt(req.params.codServicio);
  await ServicioAsignado.delete(cedEmpleado, codServicio);
  res.json({ message: "Servicio eliminado" });
});

module.exports = router;
