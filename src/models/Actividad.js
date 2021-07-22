const db = require("../db");

// Buscar todas las actividades de un servicio
const findAll = async (codServicio) => {
  const query = `
    SELECT * 
    FROM "Actividades"
    WHERE "codServicio" = $1
  `;

  const params = [codServicio]

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar por codigo y numero
const findById = async (codServicio, nroActividad) => {
  const query = `
    SELECT *
    FROM "Actividades" 
    WHERE "codServicio" = $1 
    AND "nroActividad" = $2
  `;

  const params = [
    codServicio,
    nroActividad
  ];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva actividad
const create = async (codServicio, actividad) => {
  const query = `
    INSERT INTO "Actividades"
    ("codServicio", "nroActividad", "precio", "descripcion", "capacidad")
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const params = [
    codServicio,
    actividad.nroActividad,
    actividad.precio,
    actividad.descripcion,  
    actividad.capacidad
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar una actividad
const update = async (codServicio, nroActividad, actividad) => {
  const query = `
    UPDATE "Actividades"
    SET "nroActividad" = $1,
    "precio" = $2,
    "descripcion" = $3,
    "capacidad" = $4
    WHERE "codServicio" = $5 
    AND "nroActividad" = $6
    RETURNING *
  `;

  const params = [
    actividad.nroActividad,
    actividad.precio,
    actividad.descripcion,  
    actividad.capacidad,
    codServicio,
    nroActividad
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una actividad
const deleteActividad = async (codServicio, nroActividad) => {
  const query = `
    DELETE FROM "Actividades"
    WHERE "codServicio" = $1 
    AND "nroActividad" = $2
  `;

  const params = [codServicio, nroActividad];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteActividad;
