const Router = require("express-promise-router");
const Modelo = require("../models/Modelo");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const modelos = await Modelo.findAll();
  res.json(modelos);
});

// Obtener uno
router.get("/:marca/:modelo", async (req, res) => {
  const nombreModelo = req.params.modelo;
  const marca = req.params.marca;
  const modelo = await Modelo.findById(marca, nombreModelo);
  res.json(modelo);
});

// Crear uno
router.post("/", async (req, res) => {
  const modelo = await Modelo.create(req.body);
  res.status(201).json(modelo);
});

// Actualizar
router.put("/:marca/:modelo", async (req, res) => {
  const nombreModelo = req.params.modelo;
  const marca = req.params.marca;
  const modelo = await Modelo.update(marca, nombreModelo, req.body);
  res.json(modelo);
});

// Borrar
router.delete("/:marca/:modelo", async (req, res) => {
  const nombreModelo = req.params.modelo;
  const marca = req.params.marca;
  await Modelo.delete(marca, nombreModelo);
  res.json({ message: "Modelo eliminado" });
});

module.exports = router;
