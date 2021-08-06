const Router = require("express-promise-router");
const FacturaVentas = require("../models/FacturaVentas");

const router = Router();

//Busca las facturas de una sucursal
router.get("/sucursal/:id", async(req, res) => {
  const rifSucursal = req.params.id;
  const facturas = await FacturaVentas.findAll(rifSucursal);
  res.json(facturas);
})

// Busca una factura por su numero
router.get("/:id", async(req, res) => {
  const nroFactura = parseInt(req.params.id);
  const factura = await FacturaVentas.findById(nroFactura);
  res.json(factura);
})

// Crea una factura
router.post("/", async(req, res) => {
  const factura = await FacturaVentas.create(req.body);
  res.status(201).json(factura);
})

module.exports = router;