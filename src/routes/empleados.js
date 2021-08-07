const Router = require("express-promise-router");
const Empleado = require("../models/Empleado");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  const codServicio = req.query.codServicio;
  if (codServicio) {
    const empleados = await Empleado.findByServicio(rifSucursal, codServicio);
    return res.json(empleados);
  }

  const empleados = await Empleado.findAll(rifSucursal);
  res.json(empleados);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const cedEmpleado = parseInt(req.params.id);
  const empleado = await Empleado.findById(cedEmpleado);
  res.json(empleado);
});

// Crear uno
router.post("/", async (req, res) => {
  const empleado = await Empleado.create(req.body);
  res.status(201).json(empleado);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const cedEmpleado = parseInt(req.params.id);
  const empleado = await Empleado.update(cedEmpleado, req.body);
  res.json(empleado);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const cedEmpleado = parseInt(req.params.id);
  await Empleado.delete(cedEmpleado);
  res.json({ message: "Empleado eliminado" });
});

module.exports = router;
