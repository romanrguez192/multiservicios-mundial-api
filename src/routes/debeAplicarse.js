const Router = require("express-promise-router");
const DebeAplicarse = require("../models/DebeAplicarse");

const router = new Router();

//Obtener todos
router.get("/", async (req, res) => {
  const debeAplicarse = await DebeAplicarse.findAll()

  res.json(debeAplicarse);
});

//Obtener por marca y modelo
router.get("/:marca/:modelo", async (req, res) => {
  const debeAplicarse = await DebeAplicarse.findByMarcaModelo(req.params.marca, req.params.modelo);
  res.json(debeAplicarse);
});

//Crear uno
router.post("/", async (req, res) => {
  const debeAplicarse = await DebeAplicarse.create(req.body);
  res.status(201).json(debeAplicarse);
});

//Actualizar
router.put("/:marca/:modelo/:id", async (req, res) => {
  const codProducto = parseInt(req.params.id);
  const debeAplicarse = await DebeAplicarse.update(req.params.marca, req.params.modelo, codProducto, req.body);
  res.json(debeAplicarse);
});

//Borrar
router.delete("/:marca/:modelo/:id", async (req, res) => {
  const codProducto = parseInt(req.params.id);
  await DebeAplicarse.delete(req.params.marca, req.params.modelo, codProducto);
  res.json({ message: "DebeAplicarse" });
});

module.exports = router;
