const tiposVehiculos = require("./tiposVehiculos");
const auth = require("./auth");
const lineas = require("./lineas");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
  app.use("/api/auth", auth);
  app.use("/api/lineas", lineas);
};
