const Router = require("express-promise-router");
const OrdenServicio = require("../models/OrdenServicio");

const router = new Router();

// Obtener todas las ordenes de servicio de una solicitud
router.get("/:nroSolicitud", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const ordenes = await OrdenServicio.findAll(nroSolicitud);
  res.json(ordenes);
});

// Crear una orden de servicio
router.post("/", async (req, res) => {
  const orden = await OrdenServicio.create(req.body);
  res.status(201).json(orden);
})

// Actualizar una orden de servicio
router.put("/:nroSolicitud/:codServicio/:nroActividad/:codProducto", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const codServicio = parseInt(req.params.codServicio);
  const nroActividad = parseInt(req.params.nroActividad);
  const codProducto = parseInt(req.params.codProducto);
  const fecha = req.query.fecha;

  const orden = await OrdenServicio.update(nroSolicitud, codServicio, nroActividad, codProducto, fecha, req.body);
  res.json(orden);
})

// Eliminar una orden de servicio
router.delete("/:nroSolicitud/:codServicio/:nroActividad/:codProducto", async (req, res) => {
  const nroSolicitud = parseInt(req.params.nroSolicitud);
  const codServicio = parseInt(req.params.codServicio);
  const nroActividad = parseInt(req.params.nroActividad);
  const codProducto = parseInt(req.params.codProducto);
  const fecha = req.query.fecha;

  await OrdenServicio.delete(nroSolicitud, codServicio, nroActividad, codProducto, fecha);
  res.json({ message: "Orden de servicio eliminada" });
})

module.exports = router;