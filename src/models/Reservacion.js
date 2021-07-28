const db = require("../db");

// Buscar todas las reservaciones
const findAll = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "Reservaciones"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar todas las reservaciones del cliente
const findByCliente = async (rifSucursal, cedCliente, fechaActividad) => {
  const query = `
    SELECT r.*, s.nombre AS "nombreServicio" 
    FROM "Reservaciones" AS r
    JOIN "Servicios" AS s
    ON r."codServicio" = s."codServicio"
    WHERE "rifSucursal" = $1
    AND "cedCliente" = $2
    AND "fechaActividad" :: DATE = $3 :: DATE
  `;

  const params = [rifSucursal, cedCliente, fechaActividad];

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar por nro de reserva
const findById = async (nroReserva) => {
  const query = `
    SELECT *
    FROM "Reservaciones" 
    WHERE "nroReserva" = $1
  `;

  const params = [nroReserva];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva reservacion
const create = async (reservacion) => {
  const query = `
    INSERT INTO "Reservaciones"
    ("fechaReserva", "codServicio", "fechaActividad", "montoAbonado", "rifSucursal", "cedCliente", "status")
    VALUES(NOW(), $1, $2, $3, $4, $5, 'pendiente')
    RETURNING *
  `;

  const params = [
    reservacion.codServicio,
    reservacion.fechaActividad,
    reservacion.montoAbonado,
    reservacion.rifSucursal,
    reservacion.cedCliente,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar una reservacion
const update = async (nroReserva, reservacion) => {
  const query = `
    UPDATE "Reservaciones"
    SET "codServicio" = $1,
    "fechaActividad" = $2,
    "montoAbonado" = $3,
    "rifSucursal" = $4,
    "cedCliente" = $5,
    "status" = $6
    WHERE "nroReserva" = $7
    RETURNING *
  `;

  const params = [
    reservacion.codServicio,
    reservacion.fechaActividad,
    reservacion.montoAbonado,
    reservacion.rifSucursal,
    reservacion.cedCliente,
    reservacion.status,
    nroReserva,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una reservacion
const deleteReservacion = async (nroReserva) => {
  const query = `
    DELETE FROM "Reservaciones"
    WHERE "nroReserva" = $1
  `;

  const params = [nroReserva];

  await db.query(query, params);
};

module.exports = { findAll, findByCliente, findById, create, update };
module.exports.delete = deleteReservacion;
