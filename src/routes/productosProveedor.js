const Router = require("express-promise-router");
const ProductoProveedor = require("../models/ProductoProveedor");

const router = new Router({ mergeParams: true });

// Obtener todos
router.get("/", async (req, res) => {
  const rif = parseInt(req.params.rif);
  const productosProveedor = await ProductoProveedor.findAll(rif);
  res.json(productosProveedor);
});

// Crear una
router.post("/", async (req, res) => {
  const rif = parseInt(req.params.rif);
  const codProducto = parseInt(req.body.codProducto);
  const productoProveedor = await ProductoProveedor.create(rif, codProducto);
  res.status(201).json(productoProveedor);
});

// Borrar
router.delete("/:codProducto", async (req, res) => {
  const rif = parseInt(req.params.rif);
  const codProducto = parseInt(req.params.codProducto);
  await ProductoProveedor.delete(rif, codProducto);
  res.json({ message: "Producto Proveedor eliminado" });
});

module.exports = router;
