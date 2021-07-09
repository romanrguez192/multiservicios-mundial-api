const TipoVehiculo = require("../models/TipoVehiculo");

// Obtener todos
const getTiposVehiculos = async (req, res) => {
  const tiposVehiculos = await TipoVehiculo.findAll();
  res.json(tiposVehiculos);
};

// Obtener uno
const getTipoVehiculo = async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  const tipoVehiculo = await TipoVehiculo.findById(codTipoVehiculo);
  res.json(tipoVehiculo);
};

// Crear uno
const addTipoVehiculo = async (req, res) => {
  const tipoVehiculo = await TipoVehiculo.create(req.body);
  res.status(201).json(tipoVehiculo);
};

// Actualizar
const updateTipoVehiculo = async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  const tipoVehiculo = await TipoVehiculo.update(codTipoVehiculo, req.body);
  res.json(tipoVehiculo);
};

// Borrar
const deleteTipoVehiculo = async (req, res) => {
  const codTipoVehiculo = parseInt(req.params.id);
  await TipoVehiculo.delete(codTipoVehiculo);
  res.json({ message: "Tipo de Vehiculo eliminado" });
};

module.exports = {
  getTiposVehiculos,
  getTipoVehiculo,
  addTipoVehiculo,
  updateTipoVehiculo,
  deleteTipoVehiculo,
};
