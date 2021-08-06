const Router = require("express-promise-router");


const router = new Router();

router.get("/clientes", async(req, res) => {
  const rifSucursal = req.params.id;

})

module.exports = router;