const Router = require("express-promise-router");
const Reservacion = require("../models/Reservacion");

const router = new Router();

// Obtener todas
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  const cedCliente = parseInt(req.query.cedCliente);
  const fechaActividad = req.query.fechaActividad;

  console.log(req.query)

  if (cedCliente && fechaActividad) {
    const reservaciones = await Reservacion.findByCliente(rifSucursal, cedCliente, fechaActividad);
    return res.json(reservaciones);
  }

  const reservaciones = await Reservacion.findAll(rifSucursal);
  res.json(reservaciones);
});

// Obtener una
router.get("/:id", async (req, res) => {
  const numeroReserva = parseInt(req.params.id);
  const reservacion = await Reservacion.findById(numeroReserva);
  res.json(reservacion);
});

// Crear una
router.post("/", async (req, res) => {
  const reservacion = await Reservacion.create(req.body);
  res.status(201).json(reservacion);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const numeroReserva = parseInt(req.params.id);
  const reservacion = await Reservacion.update(numeroReserva, req.body);
  res.json(reservacion);
});

//Borrar
router.delete("/:id", async (req, res) => {
  const numeroReserva = parseInt(req.params.id);
  await Reservacion.delete(numeroReserva);
  res.json({ message: "Reservación eliminada" });
});

module.exports = router;
