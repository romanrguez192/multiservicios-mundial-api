const Router = require("express-promise-router");
const Actividad = require("../models/Actividad");

const router = new Router({ mergeParams: true });

// Obtener todas
router.get("/", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const actividades = await Actividad.findAll(codServicio);
  res.json(actividades);
});

// Obtener uno
router.get("/:nro", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const nroActividad = parseInt(req.params.nro);
  const actividad = await Actividad.findById(codServicio, nroActividad);
  res.json(actividad);
});

// Crear una
router.post("/", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const actividad = await Actividad.create(codServicio, req.body);
  res.status(201).json(actividad);
});

// Actualizar
router.put("/:nro", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const nroActividad = parseInt(req.params.nro);
  const actividad = await Actividad.update(codServicio, nroActividad, req.body);
  res.json(actividad);
});

// Borrar
router.delete("/:nro", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const nroActividad = parseInt(req.params.nro);
  await Actividad.delete(codServicio, nroActividad);
  res.json({ message: "Actividad eliminada" });
});

module.exports = router;
