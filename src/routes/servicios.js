const Router = require("express-promise-router");
const Servicio = require("../models/Servicio");
const actividades = require("./actividades");

const router = new Router();

router.use("/:id/actividades", actividades);

// Obtener todos
router.get("/", async (req, res) => {
  const servicio = await Servicio.findAll();
  res.json(servicio);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const servicio = await Servicio.findById(codServicio);
  res.json(servicio);
});

// Crear una
router.post("/", async (req, res) => {
  const servicio = await Servicio.create(req.body);
  res.status(201).json(servicio);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  const servicio = await Servicio.update(codServicio, req.body);
  res.json(servicio);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codServicio = parseInt(req.params.id);
  await Servicio.delete(codServicio);
  res.json({ message: "Servicio eliminado" });
});

module.exports = router;
