const Router = require("express-promise-router");
const Linea = require("../models/Linea");

const router = new Router();

// Obtener todas
router.get("/", async (req, res) => {
  const lineas = await Linea.findAll();
  res.json(lineas);
});

// Obtener una
router.get("/:id", async (req, res) => {
  const codLinea = parseInt(req.params.id);
  const linea = await Linea.findById(codLinea);
  res.json(linea);
});

// Crear una
router.post("/", async (req, res) => {
  const linea = await Linea.create(req.body);
  res.status(201).json(linea);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codLinea = parseInt(req.params.id);
  const linea = await Linea.update(codLinea, req.body);
  res.json(linea);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codLinea = parseInt(req.params.id);
  await Linea.delete(codLinea);
  res.json({ message: "Linea eliminada" });
});

module.exports = router;
