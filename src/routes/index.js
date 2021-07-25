const tiposVehiculos = require("./tiposVehiculos");
const sucursales = require("./sucursales");
const auth = require("./auth");
const lineas = require("./lineas");
const productosServicios = require("./productosServicios");
const productosVentas = require("./productosVentas");
const inventario = require("./inventario");
const proveedores = require("./proveedores");
const modelos = require("./modelos");
const servicios = require("./servicios");
const vehiculos = require("./vehiculos");
const empleados = require("./empleados");
const serviciosOfrecidos = require("./serviciosOfrecidos");
const serviciosAsignados = require("./serviciosAsignados");
const reservaciones = require("./reservaciones");
const clientes = require("./clientes");
const productos = require("./productos");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
  app.use("/api/sucursales", sucursales);
  app.use("/api/auth", auth);
  app.use("/api/lineas", lineas);
  app.use("/api/productosServicios", productosServicios);
  app.use("/api/productosVentas", productosVentas);
  app.use("/api/inventario", inventario);
  app.use("/api/proveedores", proveedores);
  app.use("/api/modelos", modelos);
  app.use("/api/serviciosOfrecidos", serviciosOfrecidos);
  app.use("/api/serviciosAsignados", serviciosAsignados);
  app.use("/api/servicios", servicios);
  app.use("/api/empleados", empleados);
  app.use("/api/vehiculos", vehiculos);
  app.use("/api/reservaciones", reservaciones);
  app.use("/api/productos", productos);
  app.use("/api/clientes", clientes);
};
