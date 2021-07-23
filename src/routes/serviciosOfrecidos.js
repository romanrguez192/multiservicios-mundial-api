const Router = require("express-promise-router");
const ServicioOfrecido = require("../models/ServicioOfrecido");

const router = new Router();

// Obtener todos de una sucursal
router.get("/:id", async (req, res) => {
  const rifSucursal = parseInt(req.params.id);
  const serviciosOfrecidos = await ServicioOfrecido.findAll(rifSucursal);
  res.json(serviciosOfrecidos);
});

// Crear uno
router.post("/", async (req, res) => {
  const servicioOfrecido = await ServicioOfrecido.create(req.body);
  res.status(201).json(servicioOfrecido);
});

// Actualizar
router.put("/:codServicio/:cedEmpleado", async (req, res) => {
  const codServicio = parseInt(req.params.codServicio);
  const cedEmpleado = parseInt(req.params.cedEmpleado);
  const cedNuevoCoordinador = parseInt(req.body.cedCoordinador);
  const servicioOfrecido = await ServicioOfrecido.update(codServicio, cedEmpleado, cedNuevoCoordinador);
  res.json(servicioOfrecido);
});

// Borrar
router.delete("/:codServicio/:cedEmpleado", async (req, res) => {
  const codServicio = parseInt(req.params.codServicio);
  const cedEmpleado = parseInt(req.params.cedEmpleado);
  await ServicioOfrecido.delete(codServicio, cedEmpleado);
  res.json({ message: "Servicio eliminado" });
});

module.exports = router;
