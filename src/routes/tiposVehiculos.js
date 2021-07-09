const Router = require("express-promise-router");
const {
  getTiposVehiculos,
  getTipoVehiculo,
  addTipoVehiculo,
  updateTipoVehiculo,
  deleteTipoVehiculo,
} = require("../controllers/tiposVehiculos");

const router = new Router();

router.get("/", getTiposVehiculos);
router.get("/:id", getTipoVehiculo);
router.post("/", addTipoVehiculo);
router.put("/:id", updateTipoVehiculo);
router.delete("/:id", deleteTipoVehiculo);

module.exports = router;
