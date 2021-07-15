const Router = require("express-promise-router");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const tiposVehiculos = await TipoVehiculo.findAll();
  res.json(tiposVehiculos);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  const tipoVehiculo = await TipoVehiculo.findById(codTipoVehiculo);
  res.json(tipoVehiculo);
});

// Crear uno
router.post("/", async (req, res) => {
  const tipoVehiculo = await TipoVehiculo.create(req.body);
  res.status(201).json(tipoVehiculo);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  const tipoVehiculo = await TipoVehiculo.update(codTipoVehiculo, req.body);
  res.json(tipoVehiculo);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  await TipoVehiculo.delete(codTipoVehiculo);
  res.json({ message: "Tipo de Vehiculo eliminado" });
});

module.exports = router;
