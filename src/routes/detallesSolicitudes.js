const Router = require("express-promise-router");
const DetallesSolicitudes = require("../models/DetallesSolicitudes");

const router = new Router();

// Obtener todas
router.get("/", async (req, res) => {
  const detalles = await DetallesSolicitudes.findAll();
  res.json(detalles);
});

// Obtener detalles de solicitud
router.get("/:nroActividad", async (req, res) => {
  const nroActividad = req.params.nroActividad;
  const detalles = await DetallesSolicitudes.findById(nroActividad);
  res.json(detalles);
});

// Crear un detalle
router.post("/", async (req, res) => {
  const solicitud = await DetallesSolicitudes.create(req.body);
  res.status(201).json(solicitud);
});

// Actualizar un detalle
router.put("/:nroSolicitud/:codServicio/:nroActividad", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const codServicio = parseInt(req.params.codServicio);
  const nroActividad = parseInt(req.params.nroActividad);
  const solicitud = await DetallesSolicitudes.update(nroSolicitud, codServicio, nroActividad, req.body);
  res.status(201).json(solicitud);
});

// Borrar
router.delete("/:nroSolicitud/:codServicio/:nroActividad", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const codServicio = parseInt(req.params.codServicio);
  const nroActividad = parseInt(req.params.nroActividad);
  await DetallesSolicitudes.delete(nroSolicitud, codServicio, nroActividad);
  res.json({ message: "Detalle de solicitud eliminado" });
});

module.exports = router;
