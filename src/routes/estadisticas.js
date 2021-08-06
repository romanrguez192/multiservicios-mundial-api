const Router = require("express-promise-router");
const EstadisticasClientes = require("../models/EstadisticasClientes");

const router = new Router();

router.get("/clientesMasMenosFrecuentes", async(req, res) => {
  const rifSucursal = req.params.id;
  const clientes = await EstadisticasClientes.masMenosFrecuencia(rifSucursal);
  res.json(clientes);
})

router.get("/clientesNoUsanServicio", async(req, res) => {
  const rifSucursal = req.params.id;
  const clientes = await EstadisticasClientes.noUsanServicio(rifSucursal);
  res.json(clientes);
})

module.exports = router;