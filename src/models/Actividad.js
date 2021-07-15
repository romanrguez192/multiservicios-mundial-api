const db = require("../db");

// Buscar todas las actividades
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Actividades"
  `;

  const { rows } = await db.query(query);

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
const create = async (actividad) => {
  const query = `
    INSERT INTO "Actividades"
    ("codServicio", "nroActividad", "precio", "descripcion", "capacidad")
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const params = [
    actividad.codServicio,
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
    SET "codServicio" = $1,
    "nroActividad" = $2,
    "precio" = $3,
    "descripcion" = $4,
    "capacidad" = $5
    WHERE "codServicio" = $6 
    AND "nroActividad" = $7
    RETURNING *
  `;

  const params = [
    actividad.codServicio,
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
