const db = require("../db");

// Buscar todas las reservaciones
const findAll = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "Reservaciones"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query);

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
    ("fechaReserva", "codServicio", "fechaActividad", "montoAbonado", "rifSucursal", "cedCliente")
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const params = [
    reservacion.fechaReserva,
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
    SET "fechaReserva" = $1
    "codServicio" = $2,
    "fechaActividad" = $3,
    "montoAbonado" = $4,
    "rifSucursal" = $5,
    "cedCliente" = $6,
    WHERE "nroReserva" = $7
    RETURNING *
  `;

  const params = [
    reservacion.fechaReserva, 
    reservacion.codServicio, 
    reservacion.fechaActividad, 
    reservacion.montoAbonado, 
    reservacion.rifSucursal, 
    reservacion.cedCliente, 
    nroReserva
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

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteReservacion;
