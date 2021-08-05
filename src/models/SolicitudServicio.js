const db = require("../db");

// Buscar todos los tipos de solicitudes
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "SolicitudesServicio"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por codigo de sucursal
const findById = async (rifSucursal) => {
  const query = `
    SELECT *
    FROM "SolicitudesServicio" 
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo tipo de vehiculo
const create = async (rifSucursal, solicitud) => {
  const query = `
    INSERT INTO "SolicitudesServicio"
    ("fechaEntrada", "fechaSalidaEstimada", "fechaSalidaReal", "codVehiculo", "rifSucursal", autorizado)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const params = [
    solicitud.fechaEntrada, 
    solicitud.fechaSalidaEstimada,
    solicitud.fechaSalidaReal,
    solicitud.codVehiculo,
    rifSucursal,
    solicitud.autorizado,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un tipo de vehiculo
const update = async (nroSolicitud, solicitud) => {
  const query = `
    UPDATE "SolicitudesServicio"
    SET "fechaEntrada" = $1,
    "fechaSalidaEstimada" = $2,
    "fechaSalidaReal" = $3,
    "codVehiculo" = $4,
    autorizado = $5
    WHERE "nroSolicitud" = $6
    RETURNING *
  `;

  const params = [
    solicitud.fechaEntrada, 
    solicitud.fechaSalidaEstimada,
    solicitud.fechaSalidaReal,
    solicitud.codVehiculo,
    solicitud.autorizado,
    nroSolicitud
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un tipo de vehiculo
const deleteSolicitudServicio = async (nroSolicitud) => {
  const query = `
    DELETE FROM "SolicitudesServicio"
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteSolicitudServicio;
