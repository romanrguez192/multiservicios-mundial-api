const Router = require("express-promise-router");
const SolicitudServicio = require("../models/SolicitudServicio");

const router = new Router();

// Obtener todas
router.get("/", async (req, res) => {
  const solicitudes = await SolicitudServicio.findAll();
  res.json(solicitudes);
});

// Obtener todas de una sucursal
router.get("/:rifSucursal", async (req, res) => {
  const rifSucursal = req.params.rifSucursal;
  const solicitudes = await SolicitudServicio.findById(rifSucursal);
  res.json(solicitudes);
});

// Crear una solicitud
router.post("/:rifSucursal", async (req, res) => {
  const rifSucursal = req.params.rifSucursal;
  const solicitud = await SolicitudServicio.create(rifSucursal, req.body);
  res.status(201).json(solicitud);
});

// Actualizar una solicitud
router.post("/:nroSolicitud", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const solicitud = await SolicitudServicio.update(nroSolicitud, req.body);
  res.status(201).json(solicitud);
});

// Borrar
router.delete("/:nroSolicitud", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  await SolicitudServicio.delete(nroSolicitud);
  res.json({ message: "Solicitud eliminado" });
});

module.exports = router;
