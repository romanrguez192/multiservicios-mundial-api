const Router = require("express-promise-router");
const EstadisticasClientes = require("../models/EstadisticasClientes");
const EstadisticasMarcas = require("../models/EstadisticasMarcas");
const EstadisticasPersonal = require("../models/EstadisticasPersonal");

const router = new Router();

router.get("/clientesMasMenosFrecuentes", async (req, res) => {
  const rifSucursal = req.params.id;
  const clientes = await EstadisticasClientes.masMenosFrecuencia(rifSucursal);
  res.json(clientes);
});

router.get("/clientesNoUsanServicio", async (req, res) => {
  const rifSucursal = req.params.id;
  const clientes = await EstadisticasClientes.noUsanServicio(rifSucursal);
  res.json(clientes);
});

router.get("/marcasAtendidas", async (req, res) => {
  const rifSucursal = req.params.id;
  const marcas = await EstadisticasMarcas.marcasAtendidas(rifSucursal);
  res.json(marcas);
});

router.get("/personalServicios", async (req, res) => {
  const rifSucursal = req.params.id;
  const personal = await EstadisticasPersonal.personalServicios(rifSucursal);
  res.json(personal);
});

router.get("/productosVendidos", async (req, res) => {
  const rifSucursal = req.params.id;
  const productos = await EstadisticasProductos.productosVendidos(rifSucursal);
  res.json(productos);
});

router.get("/serviciosSolicitados", async (req, res) => {
  const rifSucursal = req.params.id;
  const servicios = await EstadisticasServicios.serviciosSolicitados(
    rifSucursal
  );
  res.json(servicios);
});

router.get("/proveedorProductos", async (req, res) => {
  const rifSucursal = req.params.id;
  const proveedores = await EstadisticasProveedores.proveedorProductos(
    rifSucursal
  );
  res.json(proveedores);
});

module.exports = router;
