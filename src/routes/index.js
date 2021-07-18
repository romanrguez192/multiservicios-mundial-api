const tiposVehiculos = require("./tiposVehiculos");
const sucursales = require("./sucursales");
const auth = require("./auth");
const lineas = require("./lineas");
const productosServicios = require("./productosServicios");
const productosVentas = require("./productosVentas");
const inventario = require("./inventario");
const proveedores = require("./proveedores");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
  app.use("/api/sucursales", sucursales);
  app.use("/api/auth", auth);
  app.use("/api/lineas", lineas);
  app.use("/api/productosServicios", productosServicios);
  app.use("/api/productosVentas", productosVentas);
  app.use("/api/inventario", inventario);
  app.use("/api/proveedores", proveedores);
};
