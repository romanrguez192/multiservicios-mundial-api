const Router = require("express-promise-router");
const Vehiculo = require("../models/Vehiculo");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const cedCliente = parseInt(req.query.cedCliente);

  if (cedCliente) {
    const vehiculos = await Vehiculo.findByCliente(cedCliente);
    return res.json(vehiculos);
  }

  const vehiculos = await Vehiculo.findAll();
  res.json(vehiculos);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const vehiculo = await Vehiculo.findById(codVehiculo);
  res.json(vehiculo);
});

// Crear uno
router.post("/", async (req, res) => {
  const vehiculo = await Vehiculo.create(req.body);
  res.status(201).json(vehiculo);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  const vehiculo = await Vehiculo.update(codVehiculo, req.body);
  res.json(vehiculo);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codVehiculo = parseInt(req.params.id);
  await Vehiculo.delete(codVehiculo);
  res.json({ message: "Tipo de Vehiculo eliminado" });
});

module.exports = router;
