const Router = require("express-promise-router");
const FacturaProveedor = require("../models/FacturaProveedor");

const router = new Router();

// Obtener todas
router.get("/:rif", async (req, res) => {
  const rif = req.params.rif;
  const facturaproveedors = await FacturaProveedor.findAll(rif);
  res.json(facturaproveedors);
});

// Obtener una
router.get("/:id", async (req, res) => {
  const codFacturaProveedor = parseInt(req.params.id);
  const facturaproveedor = await FacturaProveedor.findById(codFacturaProveedor);
  res.json(facturaproveedor);
});

// Crear una
router.post("/:rifSucursal", async (req, res) => {
  const rifSucursal = req.params.rifSucursal;
  const facturaproveedor = await FacturaProveedor.create(rifSucursal, req.body);
  res.status(201).json(facturaproveedor);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codFacturaProveedor = parseInt(req.params.id);
  const facturaproveedor = await FacturaProveedor.update(codFacturaProveedor, req.body);
  res.json(facturaproveedor);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codFacturaProveedor = parseInt(req.params.id);
  await FacturaProveedor.delete(codFacturaProveedor);
  res.json({ message: "FacturaProveedor eliminada" });
});

module.exports = router;
