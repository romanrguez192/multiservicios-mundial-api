const db = require("../db");

// Buscar todos los Servicios
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Servicios"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por codigo
const findById = async (codServicio) => {
  const query = `
    SELECT *
    FROM "Servicios" 
    WHERE "codServicio" = $1
  `;

  const params = [codServicio];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo Servicio
const create = async (servicio) => {
  const query = `
    INSERT INTO "Servicios"
    ("nombre", "descripcion", "requiereReserva", "minTiempoReserva", "porcentajeAbono")
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const params = [
    servicio.nombre,
    servicio.descripcion,
    servicio.requiereReserva,
    servicio.minTiempoReserva,
    servicio.porcentajeAbono,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un servicio
const update = async (codServicio, servicio) => {
  const query = `
    UPDATE "Servicios"
    SET "nombre" = $1,
    "descripcion" = $2,
    "requiereReserva" = $3,
    "minTiempoReserva" = $4,
    "porcentajeAbono" = $5
    WHERE "codServicio" = $6
    RETURNING *
  `;

  const params = [
    servicio.nombre,
    servicio.descripcion,
    servicio.requiereReserva,
    servicio.minTiempoReserva,
    servicio.porcentajeAbono,
    codServicio,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un servicio
const deleteServicio = async (codServicio) => {
  const query = `
    DELETE FROM "Servicios"
    WHERE "codServicio" = $1
  `;

  const params = [codServicio];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteServicio;
