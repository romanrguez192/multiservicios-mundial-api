const db = require("../db");

// Buscar todos los vehiculos
const findAll = async () => {
  const query = `
    SELECT DISTINCT v.*, c."nombre" AS "nombreCliente"
    FROM "SolicitudesServicio" AS s
    JOIN "Vehiculos" AS v
    ON s."codVehiculo" = v."codVehiculo"
    JOIN "Clientes" AS c
    ON v."cedCliente" = c."cedCliente"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar todos los vehiculos del cliente
const findByCliente = async (cedCliente) => {
  const query = `
    SELECT * 
    FROM "Vehiculos"
    WHERE "cedCliente" = $1
  `;

  const params = [cedCliente] 

  const { rows } = await db.query(query, params);

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
    ("placa", "fechaAdquisicion", "fechaRegistro", "cedCliente", "marca", "modelo", "nombreMecanico", "tlfMecanico")
    VALUES($1, $2, NOW(), $3, $4, $5, $6, $7)
    RETURNING * 
  `;

  const params = [
    vehiculo.placa,
    vehiculo.fechaAdquisicion,
    vehiculo.cedCliente,
    vehiculo.marca,
    vehiculo.modelo,
    vehiculo.nombreMecanico,
    vehiculo.tlfMecanico
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
    "nombreMecanico" = $6,
    "tlfMecanico" = $7
    WHERE "codVehiculo" = $8
    RETURNING *
  `;

  const params = [
    vehiculo.placa,
    vehiculo.fechaAdquisicion,
    vehiculo.cedCliente,
    vehiculo.marca,
    vehiculo.modelo,
    vehiculo.nombreMecanico,
    vehiculo.tlfMecanico,
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

module.exports = { findAll, findByCliente, findById, create, update };
module.exports.delete = deleteVehiculo;
