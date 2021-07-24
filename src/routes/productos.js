const Router = require("express-promise-router");
const Producto = require("../models/Producto");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codProducto = parseInt(req.params.id);
  const producto = await Producto.findById(codProducto);
  res.json(producto);
});

// Crear uno
router.post("/", async (req, res) => {
  const producto = await Producto.create(req.body);
  res.status(201).json(producto);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codProducto = parseInt(req.params.id);
  const producto = await Producto.update(codProducto, req.body);
  res.json(producto);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codProducto = parseInt(req.params.id);
  await Producto.delete(codProducto);
  res.json({ message: "Producto eliminado" });
});

module.exports = router;
