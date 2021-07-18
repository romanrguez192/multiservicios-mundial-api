const Router = require("express-promise-router");
const Proveedor = require("../models/Proveedor");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const proveedores = await Proveedor.findAll();
  res.json(proveedores);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const rifProveedor = parseInt(req.params.id);
  const proveedor = await Proveedor.findById(rifProveedor);
  res.json(proveedor);
});

// Crear uno
router.post("/", async (req, res) => {
  const proveedor = await Proveedor.create(req.body);
  res.status(201).json(proveedor);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const rifProveedor = parseInt(req.params.id);
  const proveedor = await Proveedor.update(rifProveedor, req.body);
  res.json(proveedor);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const rifProveedor = parseInt(req.params.id);
  await Proveedor.delete(rifProveedor);
  res.json({ message: "Proveedor eliminado" });
});

module.exports = router;
