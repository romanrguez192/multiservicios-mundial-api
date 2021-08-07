const Router = require("express-promise-router");
const ordCompra = require("../models/OrdenCompra");

const router = new Router();

// Obtener todos de una sucursal
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  const ordenesCompra = await ordCompra.findAll(rifSucursal);
  res.json(ordenesCompra);
});

// Obtener productos
router.get("/:codOrdCompra/productos", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  const productos = await ordCompra.findProductos(codigoOrdCompra);
  res.json(productos);
});

// Crear uno
router.post("/", async (req, res) => {
  const ordenCompra = await ordCompra.create(req.body);
  res.status(201).json(ordenCompra);
});

// Actualizar
router.put("/:codOrdCompra", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  const ordenCompra = await ordCompra.update(codigoOrdCompra, req.body);
  res.json(ordenCompra);
});

// Actualizar productos
router.get("/:codOrdCompra/productos/:codProducto", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  const codProducto = req.params.codProducto;
  const productos = await ordCompra.updatePoductos(codigoOrdCompra, codProducto, req.body.precio);
  res.json(productos);
});

// Borrar
router.delete("/:codOrdCompra", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  await ordCompra.delete(codigoOrdCompra);
  res.json({ message: "Orden de compra eliminada" });
});

module.exports = router;
