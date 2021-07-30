const Router = require("express-promise-router");
const MantenimientosPasados = require("../models/MantenimientosPrevios");

const router = new Router();

// Obtener todos de un vehiculo
router.get("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const mantenimientos = await MantenimientosPasados.findAll(codVehiculo);
  res.json(mantenimientos);
});

// Obtener todos
router.get("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const fechaMant = req.query.fechaMant;
  const mantenimiento = await MantenimientosPasados.findById(codVehiculo, fechaMant);
  res.json(mantenimiento);
});

// Crear una
router.post("/", async (req, res) => {
  const mantenimiento = await MantenimientosPasados.create(req.body);
  res.status(201).json(mantenimiento);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const fechaMant = req.query.fechaMant;
  const mantenimiento = await MantenimientosPasados.update(codVehiculo, fechaMant, req.body);
  res.json(mantenimiento);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const fechaMant = req.query.fechaMant;
  await MantenimientosPasados.delete(codVehiculo, fechaMant);
  res.json({ message: "MantenimientoPrevio eliminada" });
});

module.exports = router;
