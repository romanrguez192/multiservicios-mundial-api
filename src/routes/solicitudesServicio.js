const Router = require("express-promise-router");
const SolicitudServicio = require("../models/SolicitudServicio");
const OrdenServicio = require("../models/OrdenServicio");

const router = new Router();

// Obtener todas de una sucursal
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  const solicitudes = await SolicitudServicio.findAll(rifSucursal);
  res.json(solicitudes);
});

// Obtener una
router.get("/:nroSolicitud", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const solicitud = await SolicitudServicio.findById(nroSolicitud);
  res.json(solicitud);
});

// Obtener servicios
router.get("/:nroSolicitud/servicios", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const servicios = await SolicitudServicio.findServicios(nroSolicitud);
  res.json(servicios);
});

// Obtener detalles
router.get("/:nroSolicitud/servicios/:codServicio", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const codServicio = req.params.codServicio;
  const detalles = await SolicitudServicio.findDetalles(nroSolicitud, codServicio);
  res.json(detalles);
});

// Obtener ordenes
router.get("/:nroSolicitud/servicios/:codServicio/actividades/:nroActividad/ordenes", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const codServicio = req.params.codServicio;
  const nroActividad = req.params.nroActividad;
  const ordenes = await OrdenServicio.findAll(nroSolicitud, codServicio, nroActividad);
  res.json(ordenes);
});

// Crear una orden
router.post("/:nroSolicitud/servicios/:codServicio/actividades/:nroActividad/ordenes", async (req, res) => {
  const orden = await OrdenServicio.create(req.body);
  res.status(201).json(orden);
});

// Borrar una orden
router.delete("/:nroSolicitud/servicios/:codServicio/actividades/:nroActividad/ordenes", async (req, res) => {
  const nroSolicitud = req.params.nroSolicitud;
  const codServicio = req.params.codServicio;
  const nroActividad = req.params.nroActividad;
  const codProducto = req.query.codProducto;
  const fecha = req.query.fecha;
  await OrdenServicio.delete(nroSolicitud, codServicio, nroActividad, codProducto, fecha);
  res.status(201).json({message: "Orden eliminada"});
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
