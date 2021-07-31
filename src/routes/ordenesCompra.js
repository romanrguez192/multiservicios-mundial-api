const Router = require("express-promise-router");
const ordCompra = require("../models/OrdenCompra");

const router = new Router();

// Obtener todos de una sucursal
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  const ordenesCompra = await ordCompra.findAll(rifSucursal);
  res.json(ordenesCompra);
});

// Obtener uno
router.get("/:codOrdCompra", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  const ordenCompra = await ordCompra.findById(codigoOrdCompra);
  res.json(ordenCompra);
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

// Borrar
router.delete("/:codOrdCompra", async (req, res) => {
  const codigoOrdCompra = req.params.codOrdCompra;
  await ordCompra.delete(codigoOrdCompra);
  res.json({ message: "Orden de compra eliminada" });
});

module.exports = router;
