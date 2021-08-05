const db = require("../db");

// Buscar todos los detalles de solicitudes
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "DetallesSolicitudes"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por numero de solicitud
const findById = async (nroSolicitud) => {
  const query = `
    SELECT *
    FROM "DetallesSolicitudes" 
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo detalle de solicitud
const create = async (detalle) => {
  const query = `
    INSERT INTO "DetallesSolicitudes"
    ("nroSolicitud", "codServicio", "nroActividad", monto)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;

  const params = [
    detalle.nroSolicitud,
    detalle.codServicio,
    detalle.nroActividad,
    detalle.monto
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un detalle de solicitud
const update = async (nroSolicitud, codServicio, nroActividad, detalle) => {
  const query = `
    UPDATE "DetallesSolicitudes"
    SET "codServicio" = $1,
    "nroActividad" = $2,
    "monto" = $3,
    "nroSolicitud" = $4
    WHERE "nroSolicitud" = $5
    AND "codServicio" = $6
    AND "nroActividad" = $7
    RETURNING *
  `;

  const params = [
    detalle.codServicio,
    detalle.nroActividad,
    detalle.monto,
    detalle.nroSolicitud,
    nroSolicitud,
    codServicio,
    nroActividad
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un detalle de solicitud
const deleteDetalle = async (nroSolicitud, codServicio, nroActividad) => {
  const query = `
    DELETE FROM "DetallesSolicitudes"
    WHERE "nroSolicitud" = $1,
    "codServicio" = $2,
    "nroActividad" = $3
  `;

  const params = [
    nroSolicitud,
    codServicio,
    nroActividad
  ];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteDetalle;
