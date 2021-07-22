const Router = require("express-promise-router");
const ServicioOfrecido = require("../models/ServicioOfrecido");

const router = new Router();

// Obtener todos de una sucursal
router.get("/:id", async (req, res) => {
  const rifSucursal = parseInt(req.params.id);
  console.log("A");
  const serviciosOfrecidos = await ServicioOfrecido.findAll(rifSucursal);
  res.json(serviciosOfrecidos);
});

// Crear uno
router.post("/", async (req, res) => {
  const servicioOfrecido = await ServicioOfrecido.create(req.body);
  res.status(201).json(servicioOfrecido);
});

// TODO: OJO
// // Actualizar
// router.put("/:id", async (req, res) => {
//   const codServicioOfrecido = parseInt(req.params.id);
//   const servicioOfrecido = await ServicioOfrecido.update(
//     codServicioOfrecido,
//     req.body
//   );
//   res.json(servicioOfrecido);
// });

// Borrar
router.delete("/:codServicio/:cedEmpleado", async (req, res) => {
  const { codServicio, cedEmpleado } = req.params;
  await ServicioOfrecido.delete(codServicio, cedEmpleado);
  res.json({ message: "Servicio eliminado" });
});

module.exports = router;
