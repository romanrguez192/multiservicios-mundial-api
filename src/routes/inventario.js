const Router = require("express-promise-router");
const Inventario = require("../models/Inventario");

const router = new Router();

// Obtener uno
router.get("/:id", async (req, res) => {
  const rifSucursal = parseInt(req.params.id);
  const inventario = await Inventario.findById(rifSucursal);
  res.json(inventario);
});

module.exports = router;
