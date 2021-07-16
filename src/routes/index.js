const tiposVehiculos = require("./tiposVehiculos");
const auth = require("./auth");

module.exports = (app) => {
  app.use("/api/tiposVehiculos", tiposVehiculos);
  app.use("/api/auth", auth);
};
