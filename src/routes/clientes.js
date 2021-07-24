const Router = require("express-promise-router");
const Cliente = require("../models/Cliente");

const router = new Router();

//Obtener todos
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;

  const clientes = await (rifSucursal ? Cliente.findBySucursal(rifSucursal) : Cliente.findAll());

  res.json(clientes);
});

//Obtener uno
router.get("/:id", async (req, res) => {
  const cedula = parseInt(req.params.id);
  const cliente = await Cliente.findById(cedula);
  res.json(cliente);
});

//Crear uno
router.post("/", async (req, res) => {
  const cliente = await Cliente.create(req.body);
  res.status(201).json(cliente);
});

//Actualizar
router.put("/:id", async (req, res) => {
  const cedula = parseInt(req.params.id);
  const cliente = await Cliente.update(cedula, req.body);
  res.json(cliente);
});

//Borrar
router.delete("/:id", async (req, res) => {
  const cedula = parseInt(req.params.id);
  await Cliente.delete(cedula);
  res.json({ message: "Cliente" });
});

module.exports = router;
