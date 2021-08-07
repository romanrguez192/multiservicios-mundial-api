const Router = require("express-promise-router");
const CrearSolicitud = require("../models/CrearSolicitud");

const router = new Router();

// Crear solicitud
router.post("/:rifSucursal", async (req, res) => {
  const rifSucursal = req.params.rifSucursal;
  const codServicio = parseInt(req.query.codServicio);
  const nroActividad = parseInt(req.query.nroActividad);
  const monto = parseFloat(req.query.monto);
  const solicitud = await CrearSolicitud.create(rifSucursal, codServicio, nroActividad, monto, req.body);
  res.status(201).json(solicitud);
});

module.exports = router;