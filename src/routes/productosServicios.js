const Router = require("express-promise-router");
const ProductoServicio = require("../models/ProductoServicio");

const router = new Router();

// Obtener todos
router.get("/", async (req, res) => {
  const rifSucursal = req.query.rifSucursal;
  
  if (rifSucursal) {
    const productosServicios = await ProductoServicio.findAllSucursal(rifSucursal);
    return res.json(productosServicios);
  }  
  const productosServicios = await ProductoServicio.findAll();
  res.json(productosServicios);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const codProductoServicio = parseInt(req.params.id);
  const productoServicio = await ProductoServicio.findById(codProductoServicio);
  res.json(productoServicio);
});

// Crear una
router.post("/", async (req, res) => {
  const productoServicio = await ProductoServicio.create(req.body);
  res.status(201).json(productoServicio);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const codProductoServicio = parseInt(req.params.id);
  const productoServicio = await ProductoServicio.update(codProductoServicio, req.body);
  res.json(productoServicio);
});

// Borrar
router.delete("/:id", async (req, res) => {
  const codProductoServicio = parseInt(req.params.id);
  await ProductoServicio.delete(codProductoServicio);
  res.json({ message: "Producto Servicio eliminado" });
});

module.exports = router;
