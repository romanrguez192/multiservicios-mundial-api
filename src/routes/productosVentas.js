const Router = require("express-promise-router");
const ProductoVenta = require("../models/ProductoVenta");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  
  if (rifSucursal) {
    const productosVentas = await ProductoVenta.findAllSucursal(rifSucursal);
    return res.json(productosVentas);
  }

  const productosVentas = await ProductoVenta.findAll();
  res.json(productosVentas);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codProductoVenta = parseInt(req.params.id);
  const productoVenta = await ProductoVenta.findById(codProductoVenta);
  res.json(productoVenta);
});

// Crear una
router.post("/", async (req, res) => {
  const productoVenta = await ProductoVenta.create(req.body);
  res.status(201).json(productoVenta);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codProductoVenta = parseInt(req.params.id);
  const productoVenta = await ProductoVenta.update(codProductoVenta, req.body);
  res.json(productoVenta);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codProductoVenta = parseInt(req.params.id);
  await ProductoVenta.delete(codProductoVenta);
  res.json({ message: "Producto Venta eliminado" });
});

module.exports = router;
