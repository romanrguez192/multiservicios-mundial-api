const db = require("../db");

// Buscar todos los vehiculos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Vehiculos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por código
const findById = async (codVehiculo) => {
  const query = `
    SELECT *
    FROM "Vehiculos" 
    WHERE "codVehiculo" = $1
  `;

  const params = [codVehiculo];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo vehiculo
const create = async (vehiculo) => {
  const query = `
    INSERT INTO "Vehiculos"
    ("placa", "fechaAdquisicion", "fechaRegistro", "cedCliente", "marca", "modelo", "cedMecanico")
    VALUES($1, $2, NOW(), $3, $4, $5, $6)
    RETURNING *
  `;

  const params = [
    vehiculo.placa,
    vehiculo.fechaAdquisicion,
    vehiculo.cedCliente,
    vehiculo.marca,
    vehiculo.modelo,
    vehiculo.cedMecanico,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un vehiculo
const update = async (codVehiculo, vehiculo) => {
  const query = `
    UPDATE "Vehiculos"
    SET "placa" = $1,
    "fechaAdquisicion" = $2,
    "cedCliente" = $3,
    "marca" = $4,
    "modelo" = $5,
    "cedMecanico" = $6,
    WHERE "codVehiculo" = $7
    RETURNING *
  `;

  const params = [
    vehiculo.placa,
    vehiculo.fechaAdquisicion,
    vehiculo.cedCliente,
    vehiculo.marca,
    vehiculo.modelo,
    vehiculo.cedMecanico,
    codVehiculo
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un vehiculo
const deleteVehiculo = async (codVehiculo) => {
  const query = `
    DELETE FROM "Vehiculos"
    WHERE "codVehiculo" = $1
  `;

  const params = [codVehiculo];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteVehiculo;
