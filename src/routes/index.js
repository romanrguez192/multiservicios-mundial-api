const tiposVehiculos = require("./tiposVehiculos");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
};
