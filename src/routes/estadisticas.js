const Router = require("express-promise-router");
const EstadisticasClientes = require("../models/EstadisticasClientes");
const EstadisticasMarcas = require("../models/EstadisticasMarcas");
const EstadisticasPersonal = require("../models/EstadisticasPersonal");

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

router.get("/marcasMasAtendidas", async(req, res) => {
  const rifSucursal = req.params.id;
  const marcas = await EstadisticasMarcas.marcasMasAtendidas(rifSucursal);
  res.json(marcas);
})

router.get("/personalMasMenosServicios", async(req, res) => {
  const rifSucursal = req.params.id;
  const personal = await EstadisticasPersonal.personalQueRealizaServicios(rifSucursal);
  res.json(personal);
})

module.exports = router;