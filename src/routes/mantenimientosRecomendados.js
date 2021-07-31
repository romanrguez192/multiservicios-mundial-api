const Router = require("express-promise-router");
const MantenimientosRecomendados = require("../models/MantenimientosRecomendados");

const router = new Router();

// Obtener todos de un vehiculo
router.get("/:marca/:modelo", async (req, res) => {
  const marca = req.params.marca;
  const modelo = req.params.modelo;
  const mantenimientos = await MantenimientosRecomendados.findAll(marca, modelo);
  res.json(mantenimientos);
});

// Obtener por id {TODO: por si lo necesitamos}
// router.get("/:marca/:modelo", async (req, res) => {
//   const marca = req.params.marca;
//   const modelo = req.params.modelo;
//   const mantenimientos = await MantenimientosRecomendados.findAll(marca, modelo);
//   res.json(mantenimientos);
// });

// Crear una
router.post("/", async (req, res) => {
  const mantenimiento = await MantenimientosRecomendados.create(req.body);
  res.status(201).json(mantenimiento);
});

// Actualizar
router.put("/:marca/:modelo", async (req, res) => {
  const data = {
    marca: req.params.marca,
    modelo: req.params.modelo,
    tiempoUso: req.query.tiempoUso,
    kilometraje: req.query.kilometraje,
    mantenimiento: req.query.mantenimiento
  }
  const mantenimiento = await MantenimientosRecomendados.update(data, req.body);
  res.json(mantenimiento);
});

// Borrar
router.delete("/:marca/:modelo", async (req, res) => {
  const data = {
    marca: req.params.marca,
    modelo: req.params.modelo,
    tiempoUso: req.query.tiempoUso,
    kilometraje: req.query.kilometraje,
    mantenimiento: req.query.mantenimiento
  }
  await MantenimientosRecomendados.delete(data);
  res.json({ message: "Mantenimiento Recomendado eliminado" });
});

module.exports = router;
