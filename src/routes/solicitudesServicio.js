const Router = require("express-promise-router");
const SolicitudServicio = require("../models/SolicitudServicio");

const router = new Router();

// Obtener todas de una sucursal
router.get("/:rifSucursal", async (req, res) => {
  const rifSucursal = req.params.rifSucursal;
  const solicitudes = await SolicitudServicio.findAll(rifSucursal);
  res.json(solicitudes);
});

// Obtener una
router.get("/:nroSolicitud", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const solicitudes = await SolicitudServicio.findById(nroSolicitud);
  res.json(solicitudes);
});

// Crear una solicitud
router.post("/", async (req, res) => {
  const solicitud = await SolicitudServicio.create(req.body);
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
