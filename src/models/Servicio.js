const db = require("../db");

const fixMinTiempoReserva = (rows) => {
  rows.forEach((r) => {
    if (r.minTiempoReserva) {
      const d = r.minTiempoReserva.days;
      r.minTiempoReserva = d + " day" + (d > 1 ? "s" : "");
    }
  });
};

// Buscar todos los Servicios
const findAll = async () => {
  const query = `
    SELECT "codServicio", "nombre", "descripcion", "minTiempoReserva", "porcentajeAbono"
    FROM "Servicios"
  `;

  const { rows } = await db.query(query);

  fixMinTiempoReserva(rows);

  console.log(rows);

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

  fixMinTiempoReserva(rows);

  return rows[0];
};

// Crear nuevo Servicio
const create = async (servicio) => {
  const query = `
    INSERT INTO "Servicios"
    ("nombre", "descripcion", "minTiempoReserva", "porcentajeAbono")
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;

  const params = [
    servicio.nombre,
    servicio.descripcion,
    servicio.minTiempoReserva,
    servicio.porcentajeAbono,
  ];

  const { rows } = await db.query(query, params);

  fixMinTiempoReserva(rows);

  return rows[0];
};

// Actualizar un servicio
const update = async (codServicio, servicio) => {
  const query = `
    UPDATE "Servicios"
    SET "nombre" = $1,
    "descripcion" = $2,
    "minTiempoReserva" = $3,
    "porcentajeAbono" = $4
    WHERE "codServicio" = $5
    RETURNING *
  `;

  const params = [
    servicio.nombre,
    servicio.descripcion,
    servicio.minTiempoReserva,
    servicio.porcentajeAbono,
    codServicio,
  ];

  const { rows } = await db.query(query, params);

  fixMinTiempoReserva(rows);

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
