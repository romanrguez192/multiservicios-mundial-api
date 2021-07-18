const tiposVehiculos = require("./tiposVehiculos");
const sucursales = require("./sucursales");
const auth = require("./auth");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
  app.use("/api/sucursales", sucursales);
  app.use("/api/auth", auth);
};
