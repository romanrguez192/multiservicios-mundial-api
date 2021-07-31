const Router = require("express-promise-router");
const Sucursal = require("../models/Sucursal");

const router = new Router();

//Obtener todas
router.get("/", async (req, res) => {
  const sucursales = await Sucursal.findAll();
  res.json(sucursales);
});

//Obtener una
router.get("/:id", async (req, res) => {
  const rifSucursal = req.params.id;
  const sucursal = await Sucursal.findById(rifSucursal);
  res.json(sucursal);
});

//Crear una
router.post("/", async (req, res) => {
  const sucursal = await Sucursal.create(req.body);
  res.status(201).json(sucursal);
});

//Actualizar
router.put("/:id", async (req, res) => {
  const rifSucursal = req.params.id;
  const sucursal = await Sucursal.update(rifSucursal, req.body);
  res.json(sucursal);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const rifSucursal = req.params.id;
  await Sucursal.delete(rifSucursal);
  res.json({ message: "Sucursal" });
});

module.exports = router;
